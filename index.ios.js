/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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


/* Configuration */
Store.platform = 'ios'


/* iOS App */
const GoodQuestion = React.createClass ({
  /* Life Cycle */
  getInitialState() {
    return {
      store: Store
    }
  },

  /* Methods */


  /* Render */
  render() {
    const initialRoute = {name: 'email'}
    return (
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
    )
  }
})


/* Routing & Navigation */
let navigator
const RouteMapper = function(route, navigationOperations, onComponentRef) {
  navigator = navigationOperations
  let view
  switch (route.name) {
    case 'email': view = <EmailView />; break;
    case 'one': view = <PlaceholderViewOne />; break;
    case 'two': view = <PlaceholderViewTwo />; break;

    default: view = <EmailView />; break;
  }

  return (
    <App platform="android" style={styles.scene}>
      {view}
    </App>
  )
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
          Prev
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


/* Styles */
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
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
