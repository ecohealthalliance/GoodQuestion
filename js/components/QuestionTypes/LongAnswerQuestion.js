
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native'

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

  /* Render */
  render() {
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <View style={wrapperStyle}>
          <TextInput
            style={[inputStyle]}
            onChangeText={this.handleChange}
            numberOfLines={8}
            multiline={true}
            blurOnSubmit={true}
            placeholder="Tap to type..."
            underlineColorAndroid="transparent"
            value={this.state.value}
          />
        </View>
      </View>
    )
  }
})

const wrapperStyle = {
  borderColor: Color.background1,
  borderTopWidth: 1,
  marginHorizontal: -10,
  marginBottom: -10,
  padding: 0,
};

const inputStyle = {
  borderWidth: 0,
  paddingHorizontal: 15,
  textAlignVertical: 'top',
  paddingTop: 10,
  paddingBottom: 0,
  fontSize: 14,
};

if (Platform.OS === 'ios') {
  inputStyle.height = 180;
  inputStyle.paddingVertical = 10;
}

module.exports = LongAnswerQuestion;
