/**
 * Good Question
 */

import React, {
  AppRegistry,
  BackAndroid,
  Navigator,
  Component,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text
} from 'react-native'

// Model
import Store from './js/Store'

// Views
import App from './App'
import EmailView from './js/views/EmailView'
import PlaceholderViewOne from './js/views/PlaceholderViewOne'
import PlaceholderViewTwo from './js/views/PlaceholderViewTwo'

// Style
import Color from './js/styles/Color'

/* Configuration */
// Leave store as default


/* Android App */
const GoodQuestion = React.createClass ({
  render() {
    const initialRoute = {name: 'email'}
    return (
      <App platform="android" style={styles.scene}>
        <Navigator
          style={styles.container}
          initialRoute={initialRoute}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={RouteMapper}
          configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={NavigationBarConfig}
              style={styles.navBar}
            />
          }
        />
      </App>
    )
  }
})


/* Routing & Navigation */

let navigator
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop()
    return true
  }
  return false
})

let RouteMapper = function(route, navigationOperations, onComponentRef) {
  navigator = navigationOperations

  switch (route.name) {
    case 'email': return <EmailView />
    case 'one': return <PlaceholderViewOne />
    case 'two': return <PlaceholderViewTwo />

    default: return <EmailView />
  }
}

const NavigationBarConfig = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null
    }

    let previousRoute = navState.routeStack[index - 1]
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.name}
        </Text>
      </TouchableOpacity>
    )
  },
  RightButton: function(route, navigator, index, navState) {
    let next_route = {name: 'email'}
    let routes = navigator.getCurrentRoutes()
    if (routes[routes.length-1].name === 'email') next_route = {name: 'one'}
    if (routes[routes.length-1].name === 'one') next_route = {name: 'two'}
    return (
      <TouchableOpacity
        onPress={() => navigator.push(next_route)}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Next
        </Text>
      </TouchableOpacity>
    )
  },
  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.name} [{index}]
      </Text>
    )
  },
}


const styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: Color.background1,
  },
  navBarText: {
    color: Color.background2,
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: Color.background2,
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Color.background2,
  },
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
