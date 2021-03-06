import React from 'react';
import {
  Text,
  View,
  DatePickerAndroid,
} from 'react-native';
import Styles from '../../styles/Styles';
import ViewText from '../ViewText';
import Button from 'apsl-react-native-button';
import moment from 'moment';

const DateQuestionAndroid = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Date),
    ]),
    onChange: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    if (this.props.value) {
      const date = this.checkDate(this.props.value);
      return {
        value: date,
        valueText: moment(date).format('MMMM DD, YYYY'),
      };
    }
    return {
      value: new Date(),
    };
  },

  /* Methods */

  // Android date picker pop-up
  async showPicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.value});
      if (action !== DatePickerAndroid.dismissedAction) {
        const date = new Date(year, month, day);
        this.setState({
          value: date,
          valueText: moment(date).format('MMMM DD, YYYY'),
        });
        this.props.onChange(date);
      }
    } catch ({code, message}) {
      console.warn(`Date Picker Error: ${code} ${message}`);
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
  render() {
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <Text style={[Styles.type.h1, {marginVertical: 5, textAlign: 'center'}]}> {this.state.valueText ? this.state.valueText : '-'} </Text>
        <View style={[{marginTop: 15}]}>
          {
            this.state.valueText
             ? <Button onPress={this.showPicker} style={Styles.form.questionBtn}>Update</Button>
             : <Button onPress={this.showPicker} style={Styles.form.questionBtn}>Select Date</Button>
          }
        </View>
      </View>
    );
  },
});

module.exports = DateQuestionAndroid;
