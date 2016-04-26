import React, {
  TouchableHighlight,
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Header = React.createClass ({
  
  propTypes: {
    action: React.PropTypes.func.isRequired,
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
    return (
      <View>
        <Text style={Styles.form.button}>
          Accept
        </Text>
      </View>
    )
  }
})

module.exports = Header