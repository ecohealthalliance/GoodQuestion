import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  DatePickerIOS,
} from 'react-native'
import Styles from '../../styles/Styles'
import ViewText from '../ViewText'

const DateQuestionIOS = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Date)
    ]),
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
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <DatePickerIOS
          mode={this.props.mode}
          timeZoneOffsetInMinutes={this.props.timeZoneOffset}
          onDateChange={this.handleChange}
          date={this.checkDate(this.state.value)}
          style={{marginLeft: -9}}
          />
      </View>
    )
  }
})

module.exports = DateQuestionIOS
