
import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  TimePickerAndroid,
  TouchableWithoutFeedback,
} from 'react-native'
import Styles from '../../styles/Styles'
import Button from 'apsl-react-native-button'
import moment from 'moment'

const TimeQuestionAndroid = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: {hours: 14, minutes: 0},
      hours: 14,
      minutes: 0,
    }
  },

  getInitialState: function() {
    return {
      value: this.props.value,
      hours: this.props.value.hours,
      minutes: this.props.value.minutes,
    }
  },

  /* Methods */
  // Android date picker pop-up
  async showPicker() {
    const options = {
      hour: this.state.presetHour,
      minute: this.state.presetMinute,
    }

    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        let newValue = {hours: hour, minutes: minute}
        this.setState({
          valueText: moment(hour+':'+minute, 'H:m', true).format('hh:mm A'),
          value: newValue,
          hours: hour,
          minutes: minute,
        })
        this.props.onChange(newValue)
      }
    } catch ({code, message}) {
      console.warn('Time Picker Error: ' + code + ' ' + message)
    }
  },

  /* Render */
  render() {
    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.text}</Text>
        {
          this.state.valueText ?
          <View>
            <Text style={Styles.type.h2}> {this.state.valueText} </Text>
            <Button onPress={this.showPicker} style={Styles.form.submitBtn}>
              Update
            </Button>
          </View>
          :
          <Button onPress={this.showPicker} style={Styles.form.submitBtn}>
            Select Time
          </Button>
        }
      </View>
    )
  }
})

module.exports = TimeQuestionAndroid
