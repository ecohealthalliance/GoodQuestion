import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TimePickerAndroid,
} from 'react-native';
import Styles from '../../styles/Styles';
import ViewText from '../ViewText';
import Button from 'apsl-react-native-button';
import moment from 'moment';

const TimeQuestionAndroid = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      value: {hour: 0, minute: 0},
      hour: 0,
      minute: 0,
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
      hour: this.props.value.hour,
      minute: this.props.value.minute,
    };
  },

  /* Methods */
  // Android time picker pop-up
  async showPicker() {
    const options = {
      hour: this.state.hour,
      minute: this.state.minute,
    };

    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        const newValue = {hour: hour, minute: minute};
        this.setState({
          valueText: moment(`${hour}:${minute}`, 'H:m', true).format('hh:mm A'),
          value: newValue,
          hour: hour,
          minute: minute,
        });
        this.props.onChange(newValue);
      }
    } catch ({code, message}) {
      console.warn(`Time Picker Error: ${code} ${message}`);
    }
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
        {
          this.state.valueText
          ? <View>
              <Text style={Styles.type.h2}> {this.state.valueText} </Text>
              <Button onPress={this.showPicker} style={Styles.form.submitBtn}>
                Update
              </Button>
            </View>
          : <Button onPress={this.showPicker} style={Styles.form.submitBtn}>
              Select Time
            </Button>
        }
      </View>
    );
  },
});

module.exports = TimeQuestionAndroid;
