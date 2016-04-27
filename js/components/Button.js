import React, {
  TouchableHighlight,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Button = React.createClass ({
  
  propTypes: {
    action: React.PropTypes.func.isRequired,
  },

  /* Methods */
  handleTouch() {
    this.props.action()
  },

  /* Render */
  render() {
    return (
      <TouchableHighlight onPress={this.handleTouch}>
        <View style={Styles.type.link}>
          {this.props.children}
        </View>
      </TouchableHighlight>
    )
  }
})

module.exports = Button