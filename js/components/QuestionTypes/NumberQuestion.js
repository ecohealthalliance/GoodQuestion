import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Slider,
  TouchableWithoutFeedback,
} from 'react-native'
import Styles from '../../styles/Styles'
import {BackgroundGeolocation} from '../../api/BackgroundProcess'
import Button from '../Button'
import ViewText from '../ViewText'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

const NumberQuestion = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
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
    }
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
    const newValueLength = valueText.length
    let value = Number(valueText)
    if (!isNaN(value)) {
      if (value <= this.props.properties.min) {
        value = this.props.properties.min
        valueText = value
      } else if (value >= this.props.properties.max) {
        value = this.props.properties.max
        valueText = value
      }

      if (newValueLength === 0) {
        valueText = ''
      } else {
        this.props.onChange(value)
      }
      this.setState({
        valueText: String(valueText),
        value: value,
      })
    } else {
      console.warn('Error: ' + valueText + ' is not a valid number.')
    }
  },

  increaseCount() {
    this.handleChange(_.add(this.state.value, 1))
    // BackgroundGeolocation.playSound(this.state.value);
  },

  decreaseCount() {
    this.handleChange(_.subtract(this.state.value, 1))
    // BackgroundGeolocation.playSound(this.state.value);
  },

  getDecimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
    if (!match) { return 0 }
    return Math.max( 0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0) )
  },

  /* Render */
  render() {
    const { properties } = this.props
    return (
      <View style={Styles.question.block}>
        <ViewText 
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}> {this.props.text} </Text>
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

