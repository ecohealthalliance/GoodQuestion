import React, {
  TouchableHighlight,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Button = React.createClass ({
  
  propTypes: {
    action: React.PropTypes.func.isRequired,
    color: React.PropTypes.string,
  },

  /* Methods */
  handleTouch() {
    this.props.action()
  },

  /* Render */
  render() {
    const buttonStyle = [Styles.form.button]
    if (this.props.color === 'primary') buttonStyle.push(Styles.form.primaryButton)

    return (
      <TouchableHighlight onPress={this.handleTouch}>
        <Text style={buttonStyle}>
          {this.props.children}
        </Text>
      </TouchableHighlight>
    )
  }
})

module.exports = Button