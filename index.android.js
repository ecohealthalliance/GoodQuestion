/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  BackAndroid,
  Navigator,
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

// Views
import App from './App'
import EmailView from './js/views/EmailView'
import PlaceholderViewOne from './js/views/PlaceholderViewOne'
import PlaceholderViewTwo from './js/views/PlaceholderViewTwo'

let navigator
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop()
    return true
  }
  return false
})


const RouteMapper = function(route, navigationOperations, onComponentRef) {
  navigator = navigationOperations

  switch (route.name) {
    case 'email': return <EmailView />
    case 'one': return <PlaceholderViewOne />
    case 'two': return <PlaceholderViewTwo />

    default: return <EmailView />
  }
}

const GoodQuestion = React.createClass ({
  render() {
    const initialRoute = {name: 'email'}
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
