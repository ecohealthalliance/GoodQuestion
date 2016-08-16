import React from 'react';
import {
  View,
  Platform,
  Navigator,
  BackAndroid,
  Alert,
  AppState,
} from 'react-native';

import Drawer from 'react-native-drawer';
import PushNotification from 'react-native-push-notification';
import CodePush from 'react-native-code-push';

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

import { upsertInstallation } from '../api/Installations';
import { checkTimeTriggers } from '../api/Triggers';
import { loadCachedFormDataById } from '../api/Forms';
// import { addTimeTriggerNotification } from '../api/Notifications';

// Background
import { initializeGeolocationService, handleAppStateChange } from '../api/BackgroundProcess';

connectToParseServer(Settings.parse.serverUrl, Settings.parse.appId);

let navigator = null;
let currentUser = null;
let initialRoute = { path: 'surveylist', title: 'Surveys' };
let currentRoute = initialRoute;
const toaster = <Toaster key='toaster' />;

// Binds the hardware "back button" from Android devices
if (Platform.OS === 'android') {
  BackAndroid.addEventListener('hardwareBackPress', () => {
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
    if (Platform.OS === 'android') {
      PushNotification.configure({
        senderID: Settings.senderID,
        onRegister: this._onRegister,
        onNotification: this._onNotification,
      });
    } else {
      PushNotification.configure({
        onRegister: this._onRegister,
        onNotification: this._onNotification,
      });
    }
    // see if we have an authenticated user
    isAuthenticated((authenticated, user) => {
      if (authenticated) {
        currentUser = user;
        checkTimeTriggers();
        checkDirtyObjects((err) => {
          if (err) {
            console.warn(err);
          }
          // set state after the check is complete
          this.setState({
            isAuthenticated: authenticated,
            isLoading: false,
          });
        });
      } else {
        currentUser = null;
        this.setState({
          isAuthenticated: authenticated,
          isLoading: false,
        });
      }
    });
  },

  componentDidMount() {
    // check for hot code push updates
    CodePush.sync();
    AppState.addEventListener('change', (newState) => {
      if (newState === 'active') {
        CodePush.sync();
      }
    });

    isAuthenticated((authenticated) => {
      if (authenticated) {
        this.initializeUserServices();
      }
      this.setState({
        isAuthenticated: authenticated,
        isLoading: false,
      });
    });

    // Handle changes on AppState to minimize impact on batery life.
    AppState.addEventListener('change', handleAppStateChange);
  },

  checkNotificationPermissions() {
    if (Platform.OS === 'ios') {
      PushNotification.checkPermissions((result) => {
        if (
          PushNotification.isLoaded &&
          !result.alert ||
          !result.badge ||
          !result.sound
        ) {
          console.log('Requesting new PushNotification permissions.');
          PushNotification.requestPermissions().then((permissions) => {
            if (!permissions.alert || !permissions.badge || !permissions.sound) {
              // TODO: Notify of missing permissions and how to fix them.
              // Settings -> GoodQuestion -> Notifications
              // Notify only once.
            }
          });
        }
      });
    }
  },

  _onNotification(notification) {
    if (typeof notification === 'undefined') {
      return;
    }
    // TODO determine the type of notification
    if (notification.hasOwnProperty('data') && notification.data.hasOwnProperty('formId')) {
      const data = loadCachedFormDataById(notification.data.formId);
      if (typeof data === 'undefined' || typeof data.survey === 'undefined' || typeof data.form === 'undefined') {
        return;
      }
      const path = {path: 'form', title: data.survey.title, survey: data.survey, form: data.form, index: data.index};
      // TODO sync remote and cached notifications
      // addTimeTriggerNotification(data.survey.id, data.form.id, data.form.title, notification.message, new Date());
      // We will only route the user if notification was remote
      if (!notification.foreground) {
        if (typeof navigator === 'undefined') {
          initialRoute = path;
        } else {
          navigator.resetTo(path);
        }
      }
    }
  },

  _onRegister(registration) {
    const token = registration.token;
    const platform = registration.os;

    this.checkNotificationPermissions();
    if (platform === 'ios') {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
    upsertInstallation(token, platform, (err) => {
      if (err) {
        console.warn(err);
        return;
      }
    });
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
    this.checkNotificationPermissions();
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
    this._drawer.close();
  },

  openControlPanel() {
    this._controlPanel.navigating = false;
    this._drawer.open();
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
      currentUser: currentUser,
      path: route.path,
      previousPath: currentRoute.path,
      logout: this.logoutHandler,
      newLogin: this.state.newLogin,
    };

    currentRoute = route;

    switch (route.path) {
      case 'login':
        viewComponent = <LoginPage {...sharedProps} setAuthenticated={this.setAuthenticated} />;
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
      default:
        viewComponent = <SurveyListPage {...sharedProps} />;
        break;
    }

    // Special wrapper styles
    switch (route.path) {
      case 'login':
      case 'registration':
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
            this._drawer = ref;
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
              Store.navigator = nav;
            }}
            initialRoute={initialRoute}
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
        }}
        initialRoute={initialRoute}
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
