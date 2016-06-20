
import React, {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import dismissKeyboard from 'dismissKeyboard'
import Styles from '../../styles/Styles'
import Color from '../../styles/Color'
import ViewText from '../ViewText'

const LongAnswerQuestion = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
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

  dismiss() {
    dismissKeyboard();
  },

  /* Render */
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.dismiss}>
        <View style={Styles.question.block}>
          <ViewText
            style={Styles.question.header}
            textStyle={Styles.question.headerText}>
              Question #{this.props.index}
          </ViewText>
          <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
          <View style={wrapperStyle}>
            <TextInput
              style={inputStyle}
              onChangeText={this.handleChange}
              numberOfLines={7}
              multiline={true}
              placeholder="Tap to type..."
              underlineColorAndroid="transparent"
              value={this.state.value}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
})

const wrapperStyle = {
  borderColor: Color.background1,
  borderTopWidth: 1,
  marginHorizontal: -10,
  marginBottom: -10,
  padding: 0,
}

const inputStyle = {
  height: 180,
  borderWidth: 0,
  paddingHorizontal: 15,
  paddingVertical: 10,
  fontSize: 14,
}

module.exports = LongAnswerQuestion
