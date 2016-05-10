
import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  TouchableWithoutFeedback,
} from 'react-native'
import Styles from '../../styles/Styles'
import Button from 'apsl-react-native-button'
import moment from 'moment'

const DatetimeQuestionAndroid = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: new Date(),
      date: new Date(),
      hour: 0,
      minute: 0,
    }
  },

  getInitialState: function() {
    return {
      value: this.props.value,
      date: this.props.date,
      hour: this.props.value.hour,
      minute: this.props.value.minute,
    }
  },

  /* Methods */
  // Android date picker pop-up
  async showDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.value})
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day)
        var datetime = new Date(year, month, day)
        datetime.setHours(this.state.hour, this.state.minute)
        this.setState({
          value: datetime,
          date: date,
          dateText: moment(date).format('MMMM DD, YYYY'),
          hasDate: true,
        })

        if (this.state.hasTime) this.props.onChange(datetime)
      }
    } catch ({code, message}) {
      console.warn('Date Picker Error: ' + code + ' ' + message)
    }
  },

  // Android time picker pop-up
  async showTimePicker() {
    const options = {
      hour: this.state.hour,
      minute: this.state.minute,
    }

    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        var datetime = new Date(this.state.date.getTime())
        datetime.setHours(hour, minute)
        this.setState({
          timeText: moment(hour+':'+minute, 'H:m', true).format('hh:mm A'),
          hour: hour,
          minute: minute,
          hasTime: true,
        })
        if (this.state.hasDate) this.props.onChange(datetime)
      }
    } catch ({code, message}) {
      console.warn('Time Picker Error: ' + code + ' ' + message)
    }
  },

  /* Render */
  renderButtons() {
    return (
      <View style={Styles.form.inlineForm}>
        <Button onPress={this.showDatePicker} style={Styles.form.doubleButtonLeft}>
          {this.state.hasDate ? 'Update Date' : 'Select Date'}
        </Button>
        <Button onPress={this.showTimePicker} style={Styles.form.doubleButtonRight}>
          {this.state.hasTime ? 'Update Time' : 'Select Time'}
        </Button>
      </View>
    )
  },

  render() {
    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.text}</Text>
        <View>
          <Text style={Styles.type.h2}> {this.state.dateText ? this.state.dateText : '-'} </Text>
          <Text style={Styles.type.h2}> {this.state.timeText ? this.state.timeText : '-'} </Text>
          {this.renderButtons()}
        </View>
      </View>
    )
  }
})

module.exports = DatetimeQuestionAndroid
