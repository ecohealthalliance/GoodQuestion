import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  Slider,
  TouchableWithoutFeedback,
} from 'react-native'
import Styles from '../../styles/Styles'
import Button from '../Button'
import Icon from 'react-native-vector-icons/FontAwesome'

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
      <View style={Styles.question.block}>
        <Text style={Styles.question.header}>Question #1</Text>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <View style={[Styles.form.inlineForm, Styles.question.smallInput]}>
          <Button action={this.decreaseCount} primary round>
            <Icon name="minus" size={20} style={{color: '#FFFFFF'}} />
          </Button>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, textAlign: 'center', width: 120}}
            onChangeText={this.handleChange}
            keyboardType='numeric'
            value={this.state.valueText}
          />
          <Button action={this.increaseCount} primary round>
            <Icon name="plus" size={20} style={{color: '#FFFFFF'}} /> 
          </Button>
        </View>
      </View>
    )
  }
})

module.exports = NumberQuestion

