import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  Slider,
} from 'react-native'
import Styles from '../../styles/Styles'
import Button from 'apsl-react-native-button'

const NumberQuestion = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.shape({
      min: React.PropTypes.number.isRequired,
      max: React.PropTypes.number.isRequired,
    }),
  },

  getDefaultProps: function () {
    return {
      value: 1,
      properties: {
        min: 0,
        max: 999,
      },
    };
  },

  getInitialState: function() {
    return {
      value: this.props.value,
      valueText: String(this.props.value),
    }
  },

  /* Methods */

  // Note: The iOS TextInput display does not work well with the Number data type.
  // It must be converted to a String to avoid rendering problems.
  handleChange(valueText) {
    let value = Number(valueText)
    if (!isNaN(value)) {
      if (value < this.props.properties.min) value = this.props.properties.min
      if (value > this.props.properties.max) value = this.props.properties.max
      this.setState({
        valueText: String(value),
        value: value,
      })
      this.props.onChange(value)
    } else {
      console.warn('Eror: ' + valueText + ' is not a valid number.')
    }
  },

  increaseCount() {
    this.handleChange(this.state.value + 1)
  },

  decreaseCount() {
    this.handleChange(this.state.value - 1)
  },

  /* Render */
  render() {
    const { properties } = this.props
    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.text}</Text>
        <View style={Styles.form.doubleButtons}>
          <Button onPress={this.decreaseCount} style={Styles.form.doubleButtonLeft}>
            -
          </Button>
          <TextInput
            style={{flex:1, height: 40, borderColor: 'gray', borderWidth: 1, textAlign: 'center'}}
            onChangeText={this.handleChange}
            keyboardType='numeric'
            value={this.state.valueText}
          />
          <Button onPress={this.increaseCount} style={Styles.form.doubleButtonRight}>
            +
          </Button>
        </View>
      </View>
    )
  }
})

module.exports = NumberQuestion

