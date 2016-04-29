import React, {
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Button = React.createClass ({
  
  propTypes: {
    action: React.PropTypes.func.isRequired,
    color: React.PropTypes.string,
    wide: React.PropTypes.bool,
  },

  /* Methods */
  handleTouch() {
    this.props.action()
  },

  /* Render */
  render() {
    const buttonStyle = [Styles.form.button]
    const buttonTextStyle = [Styles.form.buttonText]
    if (this.props.wide) buttonStyle.push(Styles.form.wideButton)
    if (this.props.color === 'primary') {
      buttonStyle.push(Styles.form.primaryButton)
      buttonTextStyle.push(Styles.form.primaryButtonText)
    }

    return (
      <TouchableWithoutFeedback onPress={this.handleTouch}>
        <View style={buttonStyle}>
          <Text style={buttonTextStyle}>
            {this.props.children}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
})

module.exports = Button