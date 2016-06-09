import React, {
  View,
  Platform,
  Navigator,
  BackAndroid,
  TouchableOpacity,
  Text,
  InteractionManager,
} from 'react-native'

import Drawer from 'react-native-drawer'

import Settings from '../settings'

// Components
import Header from '../components/Header'
import Loading from '../components/Loading'

// Styles
import Styles from '../styles/Styles'

// Model
import Store from '../data/Store'

// Parse
import Parse from 'parse/react-native'
import {connectToParseServer} from '../api/ParseServer'
import {isAuthenticated, register, logout} from '../api/Account'

// Views
import LoginPage from '../views/LoginPage'
import SurveyListPage from '../views/SurveyListPage'
import TermsOfServicePage from '../views/TermsOfServicePage'
import SurveyDetailsPage from '../views/SurveyDetailsPage'
import NotificationsPage from '../views/NotificationsPage'
import RegistrationPages from '../views/RegistrationPages'
import FormPage from '../views/FormPage'
import ControlPanel from '../views/ControlPanel'
import ProfilePage from '../views/ProfilePage'

// Background
import { initializeGeolocationService } from '../api/BackgroundProcess'

initializeGeolocationService()

let navigator;
// Binds the hardware "back button" from Android devices
if ( Platform.OS === 'android' ) {
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }
    return false;
  });
}

const SharedNavigator = React.createClass ({
  getInitialState() {
    return {
      title: '',
      isLoading: true,
      isAuthenticated: false,
    }
  },

  componentWillMount() {
    connectToParseServer(Settings.parse.serverUrl, Settings.parse.appId);
  },

  componentDidMount() {
    isAuthenticated((authenticated) => {
      this.setState({
        isAuthenticated: authenticated,
        isLoading: false,
      });
    });
  },

  /* Methods */
  setAuthenticated(authenticated) {
    this.setState({
      isAuthenticated: authenticated
    }, function() {
      navigator.resetTo({path:'surveylist', title:'Surveys'});
    });
  },

  logoutHandler() {
    logout();
    this.setState({
      isAuthenticated: false,
    }, function() {
      navigator.resetTo({path:'login',title:''});
    });
  },

  closeControlPanel() {
    this._drawer.close()
  },

  openControlPanel() {
    this._controlPanel.navigating = false
    this._drawer.open()
  },

  changeRouteViaControlPanel() {
    if (this._controlPanel && this._controlPanel.navigating) {
      let path = this._controlPanel.nextPath
      let title = this._controlPanel.nextTitle
      if (navigator) {
        let routeStack = navigator.getCurrentRoutes()
        let currentRoutePath = routeStack[routeStack.length-1].path
        if (path !== currentRoutePath) {
          navigator.push({path: path, title: title})
        }
      }
    }
  },

  setSceneConfig(route) {
    let config = route.sceneConfig
    let SceneConfigs = Navigator.SceneConfigs
    if (config){
      return SceneConfigs[config]
    } else {
      // Default animation
      return SceneConfigs.FadeAndroid
    }
  },

  routeMapper(route, nav) {
    let viewComponent
    const sharedProps = {
      navigator: nav,
      logout: this.logoutHandler,
    };

    if (!this.state.isAuthenticated && !route.unsecured) {
      route.path = 'login'
      route.title = ''
    }

    switch (route.path) {
      case 'login': viewComponent = <LoginPage {...sharedProps} setAuthenticated={this.setAuthenticated} />; break;
      case 'surveylist': viewComponent = <SurveyListPage {...sharedProps} />; break;
      case 'notifications': viewComponent = <NotificationsPage {...sharedProps} />; break;
      case 'terms': viewComponent = <TermsOfServicePage {...sharedProps} />; break;
      case 'registration': viewComponent = <RegistrationPages {...sharedProps} index={route.index} />; break;
      case 'profile': viewComponent = <ProfilePage {...sharedProps} />; break;
      case 'form': viewComponent = <FormPage {...sharedProps} form={route.form} survey={route.survey} index={route.index} />; break;
      case 'survey-details': viewComponent = <SurveyDetailsPage {...sharedProps} survey={route.survey} />; break;
      default: viewComponent = <SurveyListPage {...sharedProps} />; break;
    }

    // Special wrapper styles
    switch (route.path) {
      case 'login':
      case 'registration':
        wrapperStyles = Styles.container.wrapperClearHeader;
        break;

      default: wrapperStyles = Styles.container.wrapper; break;
    }

    return (
      <View style={wrapperStyles}>
        {viewComponent}
      </View>
    )
  },

  /* Render */
  render() {
    const initialRoute = { path:'surveylist', title: 'Surveys' }

    // show loading component without the navigationBar
    if (this.state.isLoading) {
      return (<Loading/>);
    }

    if (this.state.isAuthenticated) {
      return (
        <Drawer
          type="overlay"
          ref={(ref) => this._drawer = ref}
          content={
            <ControlPanel
            ref={(ref) => this._controlPanel = ref}
            navigator={navigator}
            logout={this.logoutHandler}
            closeDrawer={this.closeControlPanel}
            changeRoute={this.changeRouteViaControlPanel}
            />
          }
          tapToClose={true}
          openDrawerOffset={0.20}
          panCloseMask={0.25}
          closedDrawerOffset={-3}
          styles={Styles.drawer}
          onClose={this.changeRouteViaControlPanel}
          tweenDuration={200}
          tweenEasing='easeOutCubic'
          >
          <Navigator
            ref={(nav) => {
              navigator = nav
              Store.navigator = nav // Store globally so we can use the navigator outside components
            }}
            initialRoute={initialRoute}
            renderScene={this.routeMapper}
            configureScene={(route, routeStack) => this.setSceneConfig(route)}
            style={{flex: 1}}
            navigationBar={
              <Header
                title={this.state.title}
                openDrawer={this.openControlPanel} />
            }
          />
        </Drawer>
      );
    }

    return(
      <Navigator
        ref={(nav) => { navigator = nav }}
        initialRoute={initialRoute}
        renderScene={this.routeMapper}
        configureScene={(route, routeStack) => this.setSceneConfig(route)}
        style={{flex: 1}}
        navigationBar={
          <Header
            title={this.state.title} />
        }
      />
    );
  }
})

module.exports = SharedNavigator
