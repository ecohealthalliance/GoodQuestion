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
import Store from './js/data/Store'

// Components
import Header from './js/components/Header'

// Views
import App from './App'
import WelcomePage from './js/views/WelcomePage'
import LoginPage from './js/views/LoginPage'
import SurveyListPage from './js/views/SurveyListPage'
import TermsOfServicePage from './js/views/TermsOfServicePage'
import RegistrationPagePart1 from './js/views/RegistrationPagePart1'
import RegistrationPagePart2 from './js/views/RegistrationPagePart2'
import RegistrationPagePart3 from './js/views/RegistrationPagePart3'
import RegistrationPagePart4 from './js/views/RegistrationPagePart4'

// Style
import Styles from './js/styles/Styles'
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
    const initialRoute = {name: 'registration1'}
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
const RouteMapper = function(route, navigationOperations, onComponentRef) {
  navigator = navigationOperations
  let view
  switch (route.name) {
    case 'welcome': view = <WelcomePage />; break;
    case 'login': view = <LoginPage />; break;
    case 'surveylist': view = <SurveyListPage />; break;
    case 'terms': view = <TermsOfServicePage />; break;

    case 'registration1': view = <RegistrationPagePart1 />; break;
    case 'registration2': view = <RegistrationPagePart2 />; break;
    case 'registration3': view = <RegistrationPagePart3 />; break;
    case 'registration4': view = <RegistrationPagePart4 />; break;

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
    else if (routes[routes.length-1].name === 'login') next_route = {name: 'surveylist'}
    else if (routes[routes.length-1].name === 'surveylist') next_route = {name: 'terms'}
    else if (routes[routes.length-1].name === 'terms') next_route = {name: 'registration1'}
    else if (routes[routes.length-1].name === 'registration1') next_route = {name: 'registration2'}
    else if (routes[routes.length-1].name === 'registration2') next_route = {name: 'registration3'}
    else if (routes[routes.length-1].name === 'registration3') next_route = {name: 'registration4'}


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
