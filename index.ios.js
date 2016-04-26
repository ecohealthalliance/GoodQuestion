/**
 * Good Question
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

// Components
import Header from './js/components/Header'

// Views
import App from './App'
import WelcomePage from './js/views/WelcomePage'
import LoginPage from './js/views/LoginPage'
import SurveyListPage from './js/views/SurveyListPage'

// Style
import Color from './js/styles/Color'

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
    const initialRoute = {name: 'welcome'}
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
          // <Header 
          //   navigator={navigator}
          //   firstIndex={{name: 'login', index: 0}}
          // />
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
    case 'welcome': view = <WelcomePage />; break;
    case 'login': view = <LoginPage />; break;
    case 'surveylist': view = <SurveyListPage />; break;

    default: view = <WelcomePage />; break;
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
    let next_route = {name: 'welcome'}
    let routes = navigator.getCurrentRoutes()
    if (routes[routes.length-1].name === 'welcome') next_route = {name: 'login'}
    if (routes[routes.length-1].name === 'login') next_route = {name: 'surveylist'}
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
