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
    if (this.props.color === 'primary') buttonStyle.push(Styles.form.primaryButton)
    if (this.props.wide) buttonStyle.push(Styles.form.wideButton)

    return (
      <TouchableWithoutFeedback onPress={this.handleTouch}>
        <Text style={buttonStyle}>
          {this.props.children}
        </Text>
      </TouchableWithoutFeedback>
    )
  }
})

module.exports = Button