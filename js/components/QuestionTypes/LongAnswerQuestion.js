
import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import Styles from '../../styles/Styles'

const LongAnswerQuestion = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function () {
    return {
      value: '',
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
        <TextInput
          style={{height: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={this.handleChange}
          numberOfLines={7}
          multiline={true}
          value={this.state.value}
        />
      </View>
    )
  }
})

module.exports = LongAnswerQuestion
