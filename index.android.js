/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

import App from './App'

const GoodQuestion = React.createClass ({
  render() {
    return (
      <App platform="android" />
    )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
