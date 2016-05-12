import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import Checkbox from 'react-native-checkbox'

import Styles from '../../styles/Styles'

import Icon from 'react-native-vector-icons/FontAwesome'

let uncheckedComponent = (<Icon name='square-o' size={30} />);
let checkedComponent = (<Icon name='check-square-o' size={30} />);

const Checkboxes = React.createClass ({
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
      selectedChoices: this.props.value || []
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
    let selectedChoices = new Set(this.state.selectedChoices);
    return (
      <View style={Styles.question.block}>
        <Text style={Styles.question.header}>Question #1</Text>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        {this.props.properties.choices.map((choice, idx)=>{
          return (<Checkbox
            label={choice}
            key={idx}
            labelStyle={{height:34, textAlignVertical: "center"}}
            checked={selectedChoices.has(choice)}
            uncheckedComponent={uncheckedComponent}
            checkedComponent={checkedComponent}
            onChange={(checked)=>{
              if (checked) {
                selectedChoices.add(choice);
              } else {
                selectedChoices.delete(choice);
              }
              this.setState({
                selectedChoices: selectedChoices
              });
              this.props.onChange(Array.from(this.state.selectedChoices));
            }}
          />);
        })}
      </View>
    )
  }
})

module.exports = Checkboxes
