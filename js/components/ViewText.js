// Reusable component to handle bug with Android devices no supporting paddingTop in Text components.
import React, {
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Button = React.createClass ({
  propTypes: {
    style: React.PropTypes.object,
    textStyle: React.PropTypes.object,
  },

  /* Render */
  render() {
    return (
      <View style={this.props.style}>
        <Text style={this.props.textStyle}>
          {this.props.children}
        </Text>
      </View>
    )
  }
})

module.exports = Button
