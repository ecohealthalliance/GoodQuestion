import React from 'react';
import {
  View,
  Platform,
  Navigator,
  BackAndroid,
  Alert,
  AppState,
  Linking,
} from 'react-native';

import Drawer from 'react-native-drawer';
import CodePush from 'react-native-code-push';
import URL from 'url';
import async from 'async';

import Settings from '../settings';

// Components
import Header from '../components/Header';
import Loading from '../components/Loading';
import Toaster from '../components/Toaster';

// Styles
import Styles from '../styles/Styles';

// Model
import Store from '../data/Store';

import {connectToParseServer} from '../api/ParseServer';
import {isAuthenticated, logout} from '../api/Account';
import {checkDirtyObjects} from '../services/CheckDirty';

// Views
import LoginPage from '../views/LoginPage';
import SurveyListPage from '../views/SurveyListPage';
import TermsOfServicePage from '../views/TermsOfServicePage';
import SurveyDetailsPage from '../views/SurveyDetailsPage';
import NotificationsPage from '../views/NotificationsPage';
import MapPage from '../views/MapPage';
import CalendarPage from '../views/CalendarPage';
import RegistrationPages from '../views/RegistrationPages';
import FormPage from '../views/FormPage';
import ControlPanel from '../views/ControlPanel';
import ProfilePage from '../views/ProfilePage';
import ForgotPasswordPage from '../views/ForgotPasswordPage';
import VerifyForgotPasswordPage from '../views/VerifyForgotPasswordPage';

import { checkTimeTriggers } from '../api/Triggers';
import { initializeNotifications } from '../api/Notifications';

// Background
import { initializeGeolocationService, handleAppStateChange } from '../api/BackgroundProcess';

connectToParseServer(Settings.parse.serverUrl, Settings.parse.appId);

let navigator = null;
let initialRouteStack = Store.initialRouteStack;
let currentRoute = initialRouteStack[0];
let drawer = null;
const toaster = <Toaster key='toaster' />;

// Binds the hardware "back button" from Android devices
if (Platform.OS === 'android') {
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (drawer && drawer._open) {
      drawer.close();
      return true;
    }
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }
    Alert.alert('Confirm', 'Are you sure that you want to exit?', [
      {text: 'Cancel', onPress: () => { }, style: 'cancel' },
      {text: 'OK', onPress: () => {
        BackAndroid.exitApp();
      }},
    ]);
    return true;
  });
}

const SharedNavigator = React.createClass({
  getInitialState() {
    return {
      title: '',
      isLoading: true,        // Temporarily prevents the main component from rendering while loading authentication data.
      isAuthenticated: false, // Indicates if the user is currently logged in.
      newLogin: false,        // Indicates if the user has performed a login in this session.
    };
  },

  componentWillMount() {
    // flow-control
    async.auto({
      deepLinking: (cb) => {
        Linking.getInitialURL().then((url) => {
          if (url) {
            const parsed = URL.parse(url, true);
            if (parsed.protocol === 'gq:' && parsed.pathname === '/verifyForgotPassword') {
              const path = parsed.pathname.replace('/', '');
              const email = parsed.query.email;
              const code = parsed.query.code;
              const unsecured = true;
              cb(null, {path, email, code, unsecured});
              return;
            }
          }
          cb(null, null);
        });
      },
      authenticated: (cb) => {
        isAuthenticated((authenticated) => {
          cb(null, authenticated);
        });
      },
      initializeUserServices: ['authenticated', (cb, res) => {
        if (res.authenticated) {
          this.initializeUserServices();
        }
        cb(null, true);
      }],
      checkTriggers: ['authenticated', (cb, res) => {
        if (res.authenticated) {
          checkTimeTriggers();
        }
        cb(null, true);
      }],
      checkDirty: ['authenticated', (cb, res) => {
        if (res.authenticated) {
          checkDirtyObjects((err) => {
            if (err) {
              console.warn(err);
            }
            cb(null, true);
          });
          // note: the return so we wait for the cb() within the async method
          return;
        }
        cb(null, false);
      }],
    }, (err, res) => {
      // if we have deepLinking url, set the state, push the route and return
      if (res.deepLinking) {
        this.setState({
          isAuthenticated: res.authenticated,
          isLoading: false,
        }, () => {
          navigator.push(res.deepLinking);
        });
        return;
      }
      // otherwise return
      this.setState({
        isAuthenticated: res.authenticated,
        isLoading: false,
      });
    });
  },

  componentDidMount() {
    // Check if CodePush should sync when app state changes.
    CodePush.sync();
    AppState.addEventListener('change', (newState) => {
      if (newState === 'active') {
        CodePush.sync();
      }
    });

    // Handle changes on AppState to minimize impact on batery life.
    AppState.addEventListener('change', handleAppStateChange);
  },

  /* Methods */
  setAuthenticated(authenticated) {
    this.setState({
      isAuthenticated: authenticated,
      newLogin: true,
    }, () => {
      this.initializeUserServices();
      navigator.resetTo({path: 'surveylist', title: 'Surveys'});
    });
  },

  initializeUserServices() {
    initializeNotifications();
    initializeGeolocationService();
  },

  logoutHandler() {
    logout();
    this.setState({
      isAuthenticated: false,
    }, () => {
      navigator.resetTo({path: 'login', title: ''});
    });
  },

  closeControlPanel() {
    drawer.close();
  },

  openControlPanel() {
    this._controlPanel.navigating = false;
    drawer.open();
  },

  changeRouteViaControlPanel() {
    if (this._controlPanel && this._controlPanel.navigating) {
      const path = this._controlPanel.nextPath;
      const title = this._controlPanel.nextTitle;
      if (!navigator) {
        return;
      }

      const routeStack = navigator.getCurrentRoutes();
      const currentRoutePath = routeStack[routeStack.length - 1].path;
      if (path !== currentRoutePath) {
        if (path === 'surveylist') {
          // Reset route stack when viewing map to avoid multiple map components from being loaded at the same time.
          navigator.resetTo({path: path, title: title});
        } else if (navigator.getCurrentRoutes().length === 1) {
            navigator.push({path: path, title: title});
        } else {
          navigator.replaceAtIndex({path: path, title: title}, 1, () => {
            navigator.popToRoute(navigator.getCurrentRoutes()[1]);
          });
        }
      }
    }
  },

  setSceneConfig(route) {
    const config = route.sceneConfig;
    const SceneConfigs = Navigator.SceneConfigs;
    if (config) {
      return SceneConfigs[config];
    }
    // Default animation
    return SceneConfigs.FadeAndroid;
  },

  routeMapper(route, nav) {
    let viewComponent = null;
    let wrapperStyles = null;

    if (!this.state.isAuthenticated && !route.unsecured) {
      route.path = 'login';
      route.title = '';
    }

    const sharedProps = {
      navigator: nav,
      path: route.path,
      previousPath: currentRoute.path,
      logout: this.logoutHandler,
      newLogin: this.state.newLogin,
    };

    currentRoute = route;

    switch (route.path) {
      case 'login':
        viewComponent = <LoginPage {...sharedProps} setAuthenticated={this.setAuthenticated} email={route.email} password={route.password} />;
        break;
      case 'surveylist':
        viewComponent = <SurveyListPage {...sharedProps} />;
        break;
      case 'notifications':
        viewComponent = <NotificationsPage {...sharedProps} />;
        break;
      case 'map':
        viewComponent = <MapPage {...sharedProps} />;
        break;
      case 'calendar':
        viewComponent = <CalendarPage {...sharedProps} />;
        break;
      case 'terms':
        viewComponent = <TermsOfServicePage {...sharedProps} />;
        break;
      case 'registration':
        viewComponent = <RegistrationPages {...sharedProps} index={route.index} />;
        break;
      case 'profile':
        viewComponent = <ProfilePage {...sharedProps} />;
        break;
      case 'form':
        viewComponent = <FormPage {...sharedProps} form={route.form} survey={route.survey} index={route.index} type={route.type} />;
        break;
      case 'survey-details':
        viewComponent = <SurveyDetailsPage {...sharedProps} survey={route.survey} formCount={route.formCount} questionCount={route.questionCount} />;
        break;
      case 'forgotPassword':
        viewComponent = <ForgotPasswordPage {...sharedProps} email={route.email} />;
        break;
      case 'verifyForgotPassword':
        viewComponent = <VerifyForgotPasswordPage {...sharedProps} code={route.code} email={route.email} />;
        break;
      default:
        viewComponent = <SurveyListPage {...sharedProps} />;
        break;
    }

    // Special wrapper styles
    switch (route.path) {
      case 'login':
      case 'registration':
      case 'forgotPassword':
      case 'verifyForgotPassword':
        wrapperStyles = Styles.container.wrapperClearHeader;
        break;
      default:
        wrapperStyles = Styles.container.wrapper;
        break;
    }

    return (
      <View style={wrapperStyles}>
        {viewComponent}
        {toaster}
      </View>
    );
  },

  /* Render */
  render() {
    // show loading component without the navigationBar
    if (this.state.isLoading) {
      return (
        <Loading key='navigator-loading-icon' />
      );
    }

    if (this.state.isAuthenticated) {
      return (
        <Drawer
          type='overlay'
          ref={(ref) => {
            drawer = ref;
          }}
          content={
            <ControlPanel
            ref={(ref) => {
              this._controlPanel = ref;
            }}
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
          elevation={10}
          onClose={this.changeRouteViaControlPanel}
          tweenDuration={200}
          tweenEasing='easeOutCubic'
          >
          <Navigator
            ref={(nav) => {
              navigator = nav;
               // Store globally so we can use the navigator outside components
              Store.navigator = navigator;
            }}
            initialRouteStack={initialRouteStack}
            renderScene={this.routeMapper}
            configureScene={(route) => this.setSceneConfig(route)}
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

    return (
      <Navigator
        ref={(nav) => {
          navigator = nav;
          // Store globally so we can use the navigator outside components
          Store.navigator = navigator;
        }}
        initialRouteStack={initialRouteStack}
        renderScene={this.routeMapper}
        configureScene={(route) => this.setSceneConfig(route)}
        style={{flex: 1}}
        navigationBar={
          <Header
            title={this.state.title} />
        }
      />
    );
  },
});

module.exports = SharedNavigator;
