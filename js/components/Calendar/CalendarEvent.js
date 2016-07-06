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

import Icon from 'react-native-vector-icons/FontAwesome'

const CalendarEvent = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    availability: React.PropTypes.string.isRequired,
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
      description: this.props.description,
      availability: this.props.availability,
      triggered: false,
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.id,
      type: nextProps.type,
      title: nextProps.title,
      description: nextProps.description,
      availability: nextProps.availability,
      triggered: false,
    })
  },

  /* Methods */
  getCategory() {
    if (this.state.type === 'datetime') {
      return (
        <Text style={Styles.calendar.eventCategoryRowText}>
          <Icon name="clock-o" size={20} color={Color.warning} /> Date & Time
        </Text>
      );
    }
  },

  /* Render */
  render() {
    return (
      <View style={Styles.calendar.eventBlock}>
        <ViewText 
          style={Styles.calendar.eventHeader}
          textStyle={Styles.calendar.eventHeaderText}>
            {this.state.title}
        </ViewText>
        <View style={Styles.calendar.eventCategoryRow}>
          {this.getCategory()}
        </View>
        <View style={Styles.calendar.eventDescription}>
          <Text style={[Styles.type.h3, Styles.calendar.eventText]}>{this.state.description}</Text>
          <Text style={[Styles.type.h3, Styles.calendar.eventText]}>{this.state.availability}</Text>
        </View>
      </View>
    )
  }
})

module.exports = CalendarEvent
