
import React, {
  StyleSheet,
  Text,
  Picker,
  View
} from 'react-native'

import Styles from '../../styles/Styles'

const MultipleChoice = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: '',
      properties: [],
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
  render() {
    return (
      <View style={Styles.question.block}>
        <Text style={Styles.question.header}>Question #1</Text>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <Picker
          selectedValue={this.state.value}
          onValueChange={(value) =>{
            this.setState({value: value});
            this.props.onChange(value);
          }}>
          {this.props.properties.choices.map((choice, idx)=>{
            return <Picker.Item key={idx} label={choice} value={choice} />
          })}
        </Picker>
      </View>
    )
  }
})

module.exports = MultipleChoice
