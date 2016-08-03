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
      loding: true,
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
      const forms = this.sortForms();
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
   *   2 - TimeTrigger Forms available
   *   3 - TimeTrigger Forms pending
   *   4 - Geofence Forms out-of-range
   *   5 - Completed Forms
   * @return {array}    Sorted array of 'Form' objects.
   */
  sortForms() {
    const formList = this.state.forms;
    return formList;
  },

  selectForm(form) {
  },

  /* Render */
  renderItem(item) {
    const trigger = this.state.triggers.filter((trigger) => {
      return trigger.formId === item.id;
    })[0];
    console.log(trigger)
    return (
      <FormListItem {...item} trigger={trigger} onPressed={this.selectForm.bind(null, item)} />
    );
  },

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <View style={[Styles.container.default, {flex: 1}]}>
        <ListView dataSource = { this.state.dataSource }
          renderRow = { this.renderItem }
          contentContainerStyle = { [Styles.container.default, Styles.survey.list, {flex: 0}] }
          enableEmptySections
        />
      </View>
    );
  },
});

module.exports = FormListPage;
