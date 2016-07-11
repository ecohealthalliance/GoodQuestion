
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import Styles from '../../styles/Styles'
import Color from '../../styles/Color'
import ViewText from '../ViewText'

const ShortAnswer = React.createClass ({
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
        <View style={Styles.question.smallInput}>
          <TextInput
            style={{height: 40, borderColor: Color.background1, borderWidth: 1, paddingLeft: 10}}
            onChangeText={this.handleChange}
            placeholder="Tap to type..."
            value={this.state.value}
          />
        </View>
      </View>
    )
  }
})

module.exports = ShortAnswer
