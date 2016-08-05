import React from 'react';
import {
  Alert,
  View,
  ListView,
  TouchableHighlight,
} from 'react-native';
import _ from 'lodash';

import Color from '../styles/Color';
import Styles from '../styles/Styles';
import { loadCachedFormDataByTriggerId } from '../api/Forms';
import { loadSurveyTriggers } from '../api/Triggers';

import Loading from '../components/Loading';
import FormListItem from '../components/FormListItem';

const FormListPage = React.createClass({
  title: 'Forms',

  propTypes: {
    survey: React.PropTypes.object.isRequired,
    forms: React.PropTypes.object.isRequired,
    incompleteSubmissions: React.PropTypes.object,
  },

  getInitialState() {
    const forms = this.props.forms;
    console.log(this.props.incompleteSubmissions)
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
    loadSurveyTriggers({surveyId: this.props.survey.id}, (err, results) => {
      if (this.cancelCallbacks) {
        return;
      }
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
   *   1 - Forms left incomplete
   *   2 - Geofence Forms in-range
   *   3 - TimeTrigger Forms, ordered by trigger datetime values.
   *   4 - Geofence Forms out-of-range
   *   5 - Completed Forms
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

    if (this.props.incompleteSubmissions && this.props.incompleteSubmissions.length > 0) {
      sortedForms.forEach((form) => {
        if (this.props.incompleteSubmissions.filtered(`formId == "${form.id}"`)[0]) {
          form.incomplete = true;
        } else {
          form.incomplete = false;
        }
      });
    }

    sortedForms.sort((a, b) => {
      // Check for missing triggers
      if (!a.trigger) {
        return -1;
      } else if (!b.trigger) {
        return 1;
      }

      // Check for incomplete forms
      if (a.incomplete && !b.incomplete) {
        return -1;
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
          return a.trigger.inRange ? -1 : 1;
        }
        return 0;
      }

      // Handle datetime triggers
      if (a.trigger.datetime) {
        // Triggers types mismatch
        if (a.trigger.latitude || a.trigger.longitude) {
          return b.trigger.inRange ? 1 : -1;
        } else if (b.trigger.datetime) {
          return a.trigger.datetime < b.trigger.datetime ? -1 : 1;
        }
      }

      return 0;
    });
    return sortedForms;
  },

  selectForm(trigger) {
    if (!trigger) {
      Alert('There was an error trying to load this form. Please try again later.');
      return;
    }

    if (!trigger.completed) {
      if (trigger.datetime && trigger.datetime > Date.now()) {
        return; // Return if datetime hasn't been reached.
      }
      if (trigger.latitude || trigger.longitude) {
        if (!trigger.inRange) {
          return; // Return if geofence is not in range.
        }
      }
    }

    const data = loadCachedFormDataByTriggerId(trigger.id, trigger.datetime ? 'datetime' : 'geofence');
    if (!data || !data.survey || !data.form) {
      Alert('There was an error trying to load this form. Please try again later.');
      return;
    }

    this.props.navigator.push({
      path: 'form',
      title: data.survey.title,
      survey: data.survey,
      form: data.form,
      type: 'geofence',
    });
  },

  /* Render */
  renderFormItem(form) {
    if (!form.trigger) {
      form.trigger = this.state.triggers.filter((trigger) => {
        return trigger.formId === form.id;
      })[0];
    }
    return (
      <TouchableHighlight
        onPress={() => this.selectForm(form.trigger)}
        underlayColor={Color.background3}>
        <View>
          <FormListItem {...form} trigger={form.trigger} incomplete={form.incomplete} />
        </View>
      </TouchableHighlight>
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
