import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import Styles from '../../styles/Styles'
import Color from '../../styles/Color'
import ViewText from '../ViewText'

const CalendarEvent = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    questionCount: React.PropTypes.number.isRequired,
    properties: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function () {
    return {
      title: 'Form',
    };
  },

  getInitialState() {
    return {
      id: this.props.id,
      type: this.props.type,
      title: this.props.title,
      questionCount: this.props.questionCount,
      properties: this.props.properties,
      triggered: false,
    }
  },

  /* Methods */

  /* Render */
  render() {
    return (
      <View style={Styles.calendar.eventBlock}>
        <ViewText 
          style={Styles.calendar.eventHeader}
          textStyle={Styles.calendar.eventHeaderText}>
            {this.state.title}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.calendar.eventText]}>{this.state.questionCount}</Text>
        <View style={Styles.question.smallInput}>
        </View>
      </View>
    )
  }
})

module.exports = CalendarEvent
