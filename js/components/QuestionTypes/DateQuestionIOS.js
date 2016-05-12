import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  DatePickerIOS,
} from 'react-native'
import Styles from '../../styles/Styles'

const DateQuestionIOS = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    mode: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: new Date(),
      timeZoneOffset: (-1) * (new Date()).getTimezoneOffset(),
      mode: 'date',
    };
  },

  getInitialState: function() {
    return {
      value: this.checkDate(this.props.value),
      timeZoneOffsetInHours: this.props.timeZoneOffset,
    }
  },

  /* Methods */
  handleChange(value) {
    this.setState({
      value: value
    })
    this.props.onChange(value)
  },

  checkDate(value) {
    if (typeof value === 'string') {
      try {
        value = new Date(value);
      } catch(e) {
        console.error('could not parse date: ' + value);
      }
    }
    return value;
  },

  /* Render */
  render() {
    // Due to a bug in react-native's source, DatePickerIOS is currently unstable and may cause problems with rendering. 
    // Issue: https://github.com/facebook/react-native/issues/6264
    // PR fix: https://github.com/facebook/react-native/pull/7472

    return (
      <View style={Styles.question.block}>
        <Text style={Styles.question.header}>Question #1</Text>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <Text>Notice: Date Picker for iOS is currently unstable.</Text>
        <DatePickerIOS 
          mode={this.props.mode}
          timeZoneOffsetInMinutes={this.props.timeZoneOffset}
          onDateChange={this.handleChange}
          date={this.checkDate(this.state.value)}
          />
      </View>
    )
  }
})

module.exports = DateQuestionIOS

