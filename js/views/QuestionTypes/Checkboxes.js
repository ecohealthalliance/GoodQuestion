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
  getInitialState() {
    return {
      selectedChoices: this.props.value || []
    };
  },
  render() {
    let selectedChoices = new Set(this.state.selectedChoices);
    return (
      <View>
        <Text style={Styles.form.questionLabel}>{this.props.question.text}</Text>
        {this.props.question.properties.choices.map((choice, idx)=>{
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