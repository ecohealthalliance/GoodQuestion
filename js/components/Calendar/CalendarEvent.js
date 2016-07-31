import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import Styles from '../../styles/Styles';
import Color from '../../styles/Color';
import ViewText from '../ViewText';

import Icon from 'react-native-vector-icons/FontAwesome';

const CalendarEvent = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    availability: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
  },

  getDefaultProps() {
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
      onPress: this.props.onPress,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.id,
      type: nextProps.type,
      title: nextProps.title,
      description: nextProps.description,
      availability: nextProps.availability,
      triggered: false,
      onPress: nextProps.onPress,
    });
  },

  /* Methods */
  handlePress() {
    if (this.state.onPress) {
      this.state.onPress();
    }
  },

  getCategory() {
    if (this.state.type === 'datetime') {
      return (
        <Text style={Styles.calendar.eventCategoryRowText}>
          <Icon name='clock-o' size={20} color={Color.warning} /> Date & Time
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
        <TouchableOpacity onPress={this.handlePress}>
          <View style={Styles.calendar.eventDescription}>
            <Text style={[Styles.type.h3, Styles.calendar.eventText]}>{this.state.description}</Text>
            <Text style={[Styles.type.h3, Styles.calendar.eventText]}>{this.state.availability}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
});

module.exports = CalendarEvent;
