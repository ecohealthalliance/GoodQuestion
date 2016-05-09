
import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  DatePickerAndroid,
  TouchableWithoutFeedback,
} from 'react-native'
import Styles from '../../styles/Styles'
import Button from 'apsl-react-native-button'

const DateQuestionAndroid = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
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
      value: this.props.value,
    }
  },

  /* Methods */
  handleChange(value) {
    this.setState({
      value: value
    })
    this.props.onChange(value)
  },

  // Android date picker pop-up
  async showPicker() {
    stateKey = 'simple'
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.value})
      if (action !== DatePickerAndroid.dismissedAction) {
        var date = new Date(year, month, day)
        this.setState({
          value: date,
          valueText: date.toLocaleDateString()
        })
      }
    } catch ({code, message}) {
      console.warn('Date Picker Error: ' + code + ' ' + message)
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
            Select Date
          </Button>
        }
      </View>
    )
  }
})

module.exports = DateQuestionAndroid
