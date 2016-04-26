// A placeholder view for integrating native navigation

import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

import Styles from '../styles/Styles'

const WelcomePage = React.createClass ({
  render() {
    return (
      <View style={Styles.container.welcome}>
        <Text style={{color: '#000000'}}>
          Good Question
        </Text>
      </View>
    )
  }
})

module.exports = WelcomePage