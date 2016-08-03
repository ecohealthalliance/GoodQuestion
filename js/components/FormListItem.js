import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import ViewText from './ViewText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFormAvailability } from '../api/Forms';

const FormListItem = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    surveyId: React.PropTypes.string.isRequired,
    trigger: React.PropTypes.object,
  },

  getInitialState() {
    console.log(this.props.trigger)
    return {
      state: null,
      availability: {
        availableTimeTriggers: 0,
        nextTimeTrigger: false,
        geofenceTriggersInRange: 0,
      },
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.status) {
      return;
    }

    if (this.state.status !== nextProps.status) {
      // this.update(nextProps.status);
    }
  },

  componentDidMount() {
    // this.update(this.props.status);
  },

  /* Methods */

  /* Render */
  renderIcon() {
    let icon = null;
    switch (this.props.type) {
      default:
        icon = <Icon name='circle-o' size={24} color={Color.secondary} />;
    }
    return (
      <View style={{paddingTop: 4}}>
        {icon}
      </View>
    );
  },

  renderStatusText() {
    const trigger = this.props.trigger;
    if (!trigger) {
      console.warn(`No trigger found`);
      return null;
    }

    if (trigger.completed) {
      return <ViewText textStyle={Styles.survey.itemDescription}>Completed.</ViewText>;
    } else if (trigger.datetime) {
      if (trigger.datetime < Date.now()) {
        return <ViewText textStyle={Styles.survey.itemDescription}>Form available.</ViewText>;
      } else {
        return <ViewText textStyle={Styles.survey.itemDescription}>Scheduled: {moment(trigger.datetime).fromNow()}.</ViewText>;
      }
    } else if (trigger.latitude && trigger.longitude) {
      if (trigger.inRange) {
        return <ViewText textStyle={Styles.survey.itemDescription}>Form in range.</ViewText>;
      } else {
        return <ViewText textStyle={Styles.survey.itemDescription}>Form out of range.</ViewText>;
      }
    }

    return null;
  },

  render() {
    return (
      <View style={Styles.survey.listitem}>
        <View style={Styles.container.col75}>
          <Text style={Styles.survey.title}>{this.props.title}</Text>
          {this.renderStatusText()}
        </View>
        <View style={[Styles.container.col25, {alignItems: 'flex-end'}]}>
          {this.renderIcon()}
        </View>
      </View>
    );
  },
});

module.exports = FormListItem;
