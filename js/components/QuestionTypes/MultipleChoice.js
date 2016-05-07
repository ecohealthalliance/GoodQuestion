
import React, {
  StyleSheet,
  Text,
  Picker,
  View
} from 'react-native'

import Styles from '../../styles/Styles'

const MultipleChoice = React.createClass ({
  getInitialState() {
    return {
      value: this.props.value
    };
  },
  render() {
    return (
      <View>
        <Text style={Styles.form.questionLabel}>{this.props.question.text}</Text>
        <Picker
          selectedValue={this.state.value}
          onValueChange={(value) =>{
            this.setState({value: value});
            this.props.onChange(value);
          }}>
          {this.props.question.properties.choices.map((choice, idx)=>{
            return <Picker.Item key={idx} label={choice} value={choice} />
          })}
        </Picker>
      </View>
    )
  }
})

module.exports = MultipleChoice
