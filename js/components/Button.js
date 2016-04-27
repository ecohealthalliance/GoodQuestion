import React, {
  TouchableHighlight,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Button = React.createClass ({
  
  propTypes: {
    action: React.PropTypes.func.isRequired,
    wide: React.PropTypes.bool,
  },

  /* Methods */
  handleTouch(route) {
    let tabIndex = 0
    this.setState({
      tabIndex: tabIndex
    })
  },

  /* Render */
  render() {
    let buttonStyle = Styles.form.button
    if (this.props.wide) buttonStyle = [Styles.form.button, Styles.form.wideButton]

    debugger
    return (
      <Text style={buttonStyle}>
        Accept
      </Text>
    )
  }
})

module.exports = Button