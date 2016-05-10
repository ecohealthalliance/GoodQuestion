import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
  Slider,
} from 'react-native'
import Styles from '../../styles/Styles'

const ScaleQuestion = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    notes: React.PropTypes.array,
    properties: React.PropTypes.shape({
      min: React.PropTypes.number.isRequired,
      max: React.PropTypes.number.isRequired,
      minText: React.PropTypes.text,
      maxText: React.PropTypes.text,
    }),
  },

  getDefaultProps: function () {
    return {
      value: 1,
      properties: {
        min: 0,
        max: 5,
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
    this.setState({
      value: value
    })
    this.props.onChange(value)
  },

  /* Render */
  renderNotes() {
    return this.props.notes.map((note, index)=>{
      return ( 
        <Text key={'note-'+this.props.id+'-'+index}>
          {note}
        </Text>
      )
    })
  },

  render() {
    const { properties } = this.props
    console.log(properties)
    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.text}</Text>
        <Text style={Styles.type.h2}>{this.state.value}</Text>
        <Slider
          value={this.state.value}
          minimumValue={properties.min}
          maximumValue={properties.max}
          step={1}
          onValueChange={this.handleChange}
          />
        {
          properties.minText ? 
          <Text style={Styles.type.p}>
            {properties.min}: {properties.minText}
          </Text> 
          : null
        }
        {
          properties.maxText ? 
          <Text style={Styles.type.p}>
            {properties.max}: {properties.maxText}
          </Text> 
          : null
        }
      </View>
    )
  }
})

module.exports = ScaleQuestion

