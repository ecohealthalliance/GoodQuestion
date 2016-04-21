/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native'

class GoodQuestion extends Component {
  render() {
    return (
      <App platform="ios" />
    )
  }
}

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
