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
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: new Date(),
      timeZoneOffset: (-1) * (new Date()).getTimezoneOffset(),
    };
  },

  getInitialState: function() {
    return {
      value: this.props.value,
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

  /* Render */
  render() {
    // Date Picker disabled on iOS temporarily due to React Native bug.
    // Issue: https://github.com/facebook/react-native/issues/6264
    // PR fix: https://github.com/facebook/react-native/pull/7472

    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.text}</Text>
        <Text>Notice: Date Picker temporarily disabled for iOS.</Text>
        {/*
        <DatePickerIOS 
          mode="date"
          timeZoneOffsetInMinutes={this.props.timeZoneOffset}
          onDateChange={this.handleChange}
          date={this.state.value}
          />
        */}
      </View>
    )
  }
})

module.exports = DateQuestionIOS

