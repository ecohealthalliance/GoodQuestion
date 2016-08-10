import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import pubsub from 'pubsub-js';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import ViewText from './ViewText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFormAvailability } from '../api/Forms';

const SurveyListItem = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    surveyId: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired,
  },

  getInitialState() {
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
    if (!nextProps.status || nextProps.isRefreshing) {
      return;
    }
    this.update(nextProps.status);
  },

  componentDidMount() {
    this.update(this.props.status);
  },

  /* Methods */
  update(status) {
    getFormAvailability(this.props.surveyId, (err, availability) => {
      if (err) {
        console.warn(err);
        return;
      }
      if (
        availability.availableTimeTriggers !== this.state.availability.availableTimeTriggers ||
        availability.nextTimeTrigger !== this.state.availability.nextTimeTrigger ||
        availability.geofenceTriggersInRange !== this.state.availability.geofenceTriggersInRange
      ) {
        this.setState({
          status: status,
          availability: availability,
        });
      } else if (status !== this.state.status) {
        this.setState({
          status: status,
        });
      }
    });
  },

  /* Render */
  renderIcon() {
    let icon = null;
    switch (this.state.status) {
      case 'accepted':
        icon = <Icon name='check-circle' size={24} color={Color.fadedGreen} />;
        break;
      case 'declined':
        icon = <Icon name='times-circle' size={24} color={Color.fadedRed} />;
        break;
      default:
        icon = <Icon name='circle-o' size={24} color={Color.fadedRed} />;
    }
    return (
      <View style={{paddingTop: 4}}>
        {icon}
      </View>
    );
  },

  renderAvailabilityText() {
    const { geofenceTriggersInRange, availableTimeTriggers, nextTimeTrigger } = this.state.availability;

    if (geofenceTriggersInRange > 0) {
      return (
        <ViewText textStyle={Styles.survey.itemDescription}>
          {geofenceTriggersInRange} geofence {geofenceTriggersInRange > 1 ? 'forms' : 'form'} available.
        </ViewText>
      );
    } else if (availableTimeTriggers > 0) {
      return (
        <ViewText textStyle={Styles.survey.itemDescription}>
          {availableTimeTriggers} scheduled {availableTimeTriggers > 1 ? 'forms' : 'form'} available.
        </ViewText>
      );
    } else if (nextTimeTrigger && nextTimeTrigger > Date.now()) {
      return (
        <ViewText textStyle={Styles.survey.itemDescription}>
          Next form: {moment(nextTimeTrigger).fromNow()}
        </ViewText>
      );
    }
    return null;
  },

  render() {
    return (
        <View style={Styles.survey.listitem}>
          <View style={Styles.container.col75}>
            <Text style={Styles.survey.title}>{this.props.title}</Text>
            {this.renderAvailabilityText()}
          </View>
        <View style={[Styles.container.col25, {alignItems: 'flex-end'}]}>
          {this.renderIcon()}
        </View>
      </View>
    );
  },
});

module.exports = SurveyListItem;
