
import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  DatePickerAndroid,
  TouchableWithoutFeedback,
} from 'react-native'
import Styles from '../../styles/Styles'
import ViewText from '../ViewText'
import Button from 'apsl-react-native-button'
import moment from 'moment'

const DateQuestionAndroid = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: new Date(),
    }
  },

  getInitialState: function() {
    return {
      value: this.checkDate(this.props.value),
    }
  },

  /* Methods */

  // Android date picker pop-up
  async showPicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.value})
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day)
        this.setState({
          value: date,
          valueText: moment(date).format('MMMM DD, YYYY')
        })
        this.props.onChange(date)
      }
    } catch ({code, message}) {
      console.warn('Date Picker Error: ' + code + ' ' + message)
    }
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
            Select Date
          </Button>
        }
      </View>
    )
  }
})

module.exports = DateQuestionAndroid
