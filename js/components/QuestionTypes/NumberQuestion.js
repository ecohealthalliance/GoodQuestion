import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  Slider,
} from 'react-native'
import Styles from '../../styles/Styles'

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
    }
  },

  /* Methods */
  handleChange(value) {
    if (value < this.props.properties.min) value = this.props.properties.min 
    if (value > this.props.properties.max) value = this.props.properties.max
    this.setState({
      value: value
    })
    this.props.onChange(value)
  },

  /* Render */
  render() {
    const { properties } = this.props
    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.text}</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100}}
          onChangeText={this.handleChange}
          keyboardType='numeric'
          value={this.state.value}
        />
      </View>
    )
  }
})

module.exports = NumberQuestion

