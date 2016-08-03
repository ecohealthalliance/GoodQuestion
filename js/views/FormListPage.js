import React from 'react';
import {
  View,
  ListView,
} from 'react-native';

import Styles from '../styles/Styles';
import { loadNotifications } from '../api/Notifications';
import { loadCachedFormDataById } from '../api/Forms';
import { loadSurveyTriggers } from '../api/Triggers';

import Loading from '../components/Loading';
import FormListItem from '../components/FormListItem';

const FormListPage = React.createClass({
  title: 'Forms',

  propTypes: {
    survey: React.PropTypes.object.isRequired,
    forms: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    const forms = this.props.forms;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      loading: true,
      triggers: [],
      forms: forms,
      dataSource: dataSource.cloneWithRows(forms),
    };
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  componentDidMount() {
    this.update();
  },

  /* Methods */
  update() {
    console.log(this.props.survey)
    loadSurveyTriggers({surveyId: this.props.survey.id}, (err, results) => {
      if (err) {
        console.warn(err);
        this.setState({loading: false});
        return;
      }
      const timeTriggers = Array.from(results.timeTriggers);
      const geofenceTriggers = Array.from(results.geofenceTriggers);
      const triggers = _.union(timeTriggers, geofenceTriggers);
      const forms = this.sortForms(this.state.forms, triggers);
      this.setState({
        loading: false,
        triggers: triggers,
        forms: forms,
        dataSource: this.state.dataSource.cloneWithRows(forms),
      });
    });
  },
  
  /**
   * Sorts forms in the following order:
   *   1 - Geofence Forms in-range
   *   2 - TimeTrigger Forms, ordered by trigger datetime values.
   *   3 - Geofence Forms out-of-range
   *   4 - Completed Forms
   * @return {array}    Sorted array of 'Form' objects.
   */
  sortForms(forms, triggers) {
    const sortedForms = Array.from(forms);
    sortedForms.forEach((form) => {
      const formTrigger = triggers.filter((trigger) => {
        return trigger.formId === form.id;
      })[0];
      if (formTrigger) {
        form.trigger = formTrigger;
      }
    });
    
    sortedForms.sort((a, b) => {
      // Check for missing triggers
      if (!a.trigger) {
        return -1;
      } else if (!b.trigger) {
        return 1;
      }
      
      // Check completion status
      if (a.trigger.completed && !b.trigger.completed) {
        return 1;
      } else if (!a.trigger.completed && b.trigger.completed) {
        return -1;
      }
      
      // Handle geofence triggers
      if (a.trigger.latitude || a.trigger.longitude) {
        // Triggers types mismatch
        if (b.trigger.datetime) {
          return a.trigger.inRange ? 1 : -1;
        } else {
          return 0;
        }
      }
      
      // Handle datetime triggers
      if (a.trigger.datetime) {
        // Triggers types mismatch
        if (a.trigger.latitude || a.trigger.longitude) {
          return b.trigger.inRange ? -1 : 1;
        } else if (b.trigger.datetime) {
          return a.trigger.datetime < b.trigger.datetime ? 1 : -1;
        }
      }

      return 0;
    });
    return sortedForms;
  },

  selectForm(form) {
  },

  /* Render */
  renderFormItem(form) {
    if (!form.trigger) {
      form.trigger = this.state.triggers.filter((trigger) => {
        return trigger.formId === form.id;
      })[0];
    }
    return (
      <FormListItem {...form} trigger={form.trigger} onPressed={this.selectForm.bind(null, form)} />
    );
  },

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <View style={[Styles.container.default, {flex: 1}]}>
        <ListView dataSource = { this.state.dataSource }
          renderRow = { this.renderFormItem }
          contentContainerStyle = { [Styles.container.default, Styles.survey.list, {flex: 0}] }
          enableEmptySections
        />
      </View>
    );
  },
});

module.exports = FormListPage;
