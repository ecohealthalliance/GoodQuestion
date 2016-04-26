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

// Components
import Header from './js/components/Header'

// Views
import App from './App'
import WelcomePage from './js/views/WelcomePage'
import LoginPage from './js/views/LoginPage'
import SurveyListPage from './js/views/SurveyListPage'

// Style
import Styles from './js/styles/Styles'
import Color from './js/styles/Color'

/* Configuration */
Store.platform = 'android'


/* Android App */
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
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarConfig}
            style={Styles.header.navBar}
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
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop()
    return true
  }
  return false
})

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
    <App platform="android" style={Styles.container.wrapper}>
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
        style={Styles.header.navBarLeftButton}>
        <Text style={[Styles.header.navBarText, Styles.header.navBarButtonText]}>
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
        style={Styles.header.navBarRightButton}>
        <Text style={[Styles.header.navBarText, Styles.header.navBarButtonText]}>
          Next
        </Text>
      </TouchableOpacity>
    )
  },
  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[Styles.header.navBarText, Styles.header.navBarTitleText]}>
        {route.name} [{index}]
      </Text>
    )
  },
}

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
