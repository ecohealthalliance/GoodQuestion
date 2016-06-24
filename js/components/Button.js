import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Button = React.createClass ({

  propTypes: {
    action: React.PropTypes.func.isRequired,
    color: React.PropTypes.string,
    size: React.PropTypes.number,
    wide: React.PropTypes.bool,
    style: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array,
    ]),
    textStyle: React.PropTypes.object,
  },

  /* Methods */
  handleTouch() {
    this.props.action()
  },

  /* Render */
  render() {
    let buttonStyle = [Styles.form.button]
    let buttonTextStyle = [Styles.form.buttonText]

    // Square or Round
    if (this.props.round) buttonStyle = [Styles.form.roundButton]

    // Optional Rendering options
    if (this.props.wide) buttonStyle.push(Styles.form.wideButton)
    if (this.props.size) {
      buttonStyle.push({flex: this.props.size})
    }


    if (this.props.color === 'primary') {
      buttonStyle.push(Styles.form.primaryButton)
      buttonTextStyle.push(Styles.form.primaryButtonText)
    }
    if (this.props.color === 'success') {
      buttonStyle.push(Styles.form.successButton)
      buttonTextStyle.push(Styles.form.successButtonText)
    }

    return (
      <TouchableWithoutFeedback onPress={this.handleTouch}>
        <View style={[buttonStyle, this.props.style]}>
          <Text style={[buttonTextStyle, this.props.textStyle]}>
            {this.props.children}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
})

module.exports = Button
