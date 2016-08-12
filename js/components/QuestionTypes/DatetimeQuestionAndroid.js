import React from 'react';
import {
  Text,
  View,
  DatePickerAndroid,
  TimePickerAndroid,
} from 'react-native';
import Styles from '../../styles/Styles';
import ViewText from '../ViewText';
import Button from 'apsl-react-native-button';
import moment from 'moment';

const DatetimeQuestionAndroid = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Date),
    ]),
  },

  getInitialState() {
    if (this.props.value) {
      const date = this.checkDate(this.props.value);
      return {
        value: date,
        date: date,
        hour: date.getHours(),
        minute: date.getMinutes(),
        dateText: moment(date).format('MMMM DD, YYYY'),
        timeText: moment(`${date.getHours()}:${date.getMinutes()}`, 'H:m', true).format('hh:mm A'),
      };
    }
    return {
      value: new Date(),
      date: new Date(),
    };
  },

  /* Methods */
  // Android date picker pop-up
  async showDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.value});
      if (action !== DatePickerAndroid.dismissedAction) {
        const date = new Date(year, month, day);
        const datetime = new Date(year, month, day);
        datetime.setHours(this.state.hour, this.state.minute);
        this.setState({
          value: datetime,
          date: date,
          dateText: moment(date).format('MMMM DD, YYYY'),
          hasDate: true,
        });

        if (this.state.hasTime) {
          this.props.onChange(datetime);
        }
      }
    } catch ({code, message}) {
      console.warn(`Date Picker Error: ${code} ${message}`);
    }
  },

  // Android time picker pop-up
  async showTimePicker() {
    const options = {
      hour: this.state.hour,
      minute: this.state.minute,
    };

    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        const datetime = new Date(this.state.date.getTime());
        datetime.setHours(hour, minute);
        this.setState({
          timeText: moment(`${hour}:${minute}`, 'H:m', true).format('hh:mm A'),
          hour: hour,
          minute: minute,
          hasTime: true,
        });
        if (this.state.hasDate) {
          this.props.onChange(datetime);
        }
      }
    } catch ({code, message}) {
      console.warn(`Time Picker Error: ${code} ${message}`);
    }
  },

  checkDate(value) {
    let date = value;
    if (typeof value === 'string') {
      try {
        date = new Date(value);
      } catch (e) {
        console.error(`could not parse date: ${value}`);
      }
    }
    return date;
  },

  /* Render */
  renderButtons() {
    return (
      <View style={[Styles.form.inlineForm, {marginTop: 30, marginHorizontal: 20}]}>
        <Button onPress={this.showDatePicker} style={Styles.form.doubleButtonLeft}>
          {this.state.hasDate ? 'Update Date' : 'Select Date'}
        </Button>
        <Button onPress={this.showTimePicker} style={Styles.form.doubleButtonRight}>
          {this.state.hasTime ? 'Update Time' : 'Select Time'}
        </Button>
      </View>
    );
  },

  render() {
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <View>
          <Text style={[Styles.type.h1, {marginVertical: 5, textAlign: 'center'}]}> {this.state.dateText ? this.state.dateText : '-'} </Text>
          <Text style={[Styles.type.h1, {marginVertical: 5, textAlign: 'center'}]}> {this.state.timeText ? this.state.timeText : '-'} </Text>
          {this.renderButtons()}
        </View>
      </View>
    );
  },
});

module.exports = DatetimeQuestionAndroid;
