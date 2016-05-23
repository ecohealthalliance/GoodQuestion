import React, {
  View,
  Platform,
  Navigator,
  BackAndroid,
  TouchableOpacity,
  Text,
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

/* Configuration */
if (Platform.OS === 'ios') {
  Store.platform = 'ios'
} else {
  Store.platform = 'android'
}

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
    let self = this
    isAuthenticated((authenticated) => {
      console.log('authenticated')
      console.log(authenticated)
      self.setState({
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
      navigator.resetTo({});
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
    this._drawer.open()

  setSceneConfig(route) {
    let config = route.sceneConfig
    let SceneConfigs = Navigator.SceneConfigs
    if (config){
      return SceneConfigs[config]
    } else {
      // Default animation
      return SceneConfigs.FloatFromRight
    }
  },

  routeMapper(route, nav) {
    const sharedProps = {
      navigator: nav,
      logout: this.logoutHandler,
    };

    if (!this.state.isAuthenticated) {
      route.path = 'login'
      route.title = ''
    }
    switch (route.path) {
      case 'login': return <LoginPage {...sharedProps} setAuthenticated={this.setAuthenticated} />
      case 'surveylist': return <SurveyListPage {...sharedProps} />
      case 'notifications': return <NotificationsPage {...sharedProps} />
      case 'terms': return <TermsOfServicePage {...sharedProps} />
      case 'registration': return <RegistrationPages {...sharedProps} index={route.index} />
      case 'profile': return <ProfilePage {...sharedProps} />
      case 'form': return <FormPage {...sharedProps} form={route.form} survey={route.survey} index={route.index} />
      case 'survey-details': return <SurveyDetailsPage {...sharedProps} survey={route.survey} />
      default: return <SurveyListPage {...sharedProps} />
    }
  },

  /* Render */
  render() {
    const initialRoute = { path:'surveylist', title: 'Surveys' }
    // show loading component without the navigationBar
    if (this.state.isLoading) {
      return (<Loading/>);
    }
    // if this.sceneConfig Navigator.SceneConfigs.FloatFromRight
    // show the navigator
    if (this.state.isAuthenticated) {
      return (
        <Drawer
          type="overlay"
          ref={(ref) => this._drawer = ref}
          content={<ControlPanel
            navigator={navigator}
            logout={this.logoutHandler}
            closeDrawer={this.closeControlPanel} />}
          tapToClose={true}
          openDrawerOffset={0.2} // 20% gap on the right side of drawer
          panCloseMask={0.1}
          closedDrawerOffset={-3}
          styles={Styles.drawer}
          tweenHandler={(ratio) => ({
            main: { opacity:(2-ratio)/2 }
          })}
          >
          <Navigator
            ref={(nav) => {
              navigator = nav
              Store.navigator = nav // Store globally so we can use the navigator outside components
            }}
            initialRoute={initialRoute}
            renderScene={this.routeMapper}
            configureScene={(route, routeStack) => this.setSceneConfig(route)}
            style={Styles.container.wrapper}
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
        style={Styles.container.wrapper}
        navigationBar={
          <Header
            title={this.state.title} />
        }
      />
    );
  }
})

module.exports = SharedNavigator
