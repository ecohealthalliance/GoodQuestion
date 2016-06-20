import React from 'react';
import {
  View,
  Text,
} from 'react-native'
import moment from 'moment'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

import ViewText from './ViewText'
import CheckBox from './Checkbox'
import Icon from 'react-native-vector-icons/FontAwesome'

import { getFormAvailability } from '../api/Surveys'

const SurveyListItem = React.createClass ({
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
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.status !== nextProps.status) {
      this.update(nextProps.status)
    }
  },

  componentDidMount() {
    this.update(this.props.status)
  },

  shouldComponentUpdate(nextProps, nextState) {
    return  this.state.status !== nextProps.status ||
            this.state.availability !== nextState.availability
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
      } else {
        this.setState({
          status: status
        });
      }
    });

  },

  /* Render */
  renderIcon() {
    let icon
    switch(this.state.status) {
      case 'accepted': icon = <Icon name='check-circle' size={28} color={Color.fadedGreen} />; break;
      case 'declined': icon = <Icon name='times-circle' size={28} color={Color.fadedRed} />; break;
      default: icon = <Icon name='circle-o' size={28} color={Color.fadedRed} />; break;
    }
    return (
      <View style={{paddingTop: 4}}>
        {icon}
      </View>
    )
  },

  renderAvailabilityText() {
    availability = this.state.availability
    if (availability.geofenceTriggersInRange > 0) {
      // TODO: notify about geofence triggers
    } else if (availability.availableTimeTriggers > 0) {
      return (
        <ViewText textStyle={Styles.survey.itemDescription}>
          {availability.availableTimeTriggers} scheduled {availability.availableTimeTriggers > 1 ? 'forms' : 'form'} available.
        </ViewText>
      )
    } else if (availability.nextTimeTrigger && availability.nextTimeTrigger > Date.now() ) {
      return (
        <ViewText textStyle={Styles.survey.itemDescription}>
          Next form: {moment(availability.nextTimeTrigger).fromNow()}
        </ViewText>
      )
    } else {
      return null
    }
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
    )
  }
});

module.exports = SurveyListItem;
