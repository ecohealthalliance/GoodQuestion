import React from 'react';
import {
  Text,
  View,
  DatePickerIOS,
} from 'react-native';
import Styles from '../../styles/Styles';
import ViewText from '../ViewText';

const DateQuestionIOS = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Date),
    ]),
    mode: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      value: new Date(),
      timeZoneOffset: -1 * new Date().getTimezoneOffset(),
      mode: 'date',
    };
  },

  getInitialState() {
    return {
      value: this.checkDate(this.props.value),
      timeZoneOffsetInHours: this.props.timeZoneOffset,
    };
  },

  /* Methods */
  handleChange(value) {
    this.setState({
      value: value,
    });
    this.props.onChange(value);
  },

  checkDate(value) {
    let date = value;
    if (typeof value === 'string') {
      try {
        date = new Date(value);
      } catch (e) {
        console.error(`could not parse date:  ${value}`);
      }
    }
    return date;
  },

  /* Render */
  render() {
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <View style={{flex: 1, alignItems: 'center', overflow: 'hidden'}} >
          <DatePickerIOS
            mode={this.props.mode}
            timeZoneOffsetInMinutes={this.props.timeZoneOffset}
            onDateChange={this.handleChange}
            date={this.checkDate(this.state.value)}
            style={[
              {transform: [{scale: 0.80}]},
            ]}
            />
        </View>
      </View>
    );
  },
});

module.exports = DateQuestionIOS;
