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
        <Text style={Styles.form.button}>
          {this.props.children}
        </Text>

      </TouchableHighlight>
    )
  }
})

module.exports = Button