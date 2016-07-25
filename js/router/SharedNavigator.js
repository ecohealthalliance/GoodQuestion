import React, {
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
import RegistrationPages from '../views/RegistrationPages';
import FormPage from '../views/FormPage';
import ControlPanel from '../views/ControlPanel';
import ProfilePage from '../views/ProfilePage';

import { upsertInstallation } from '../api/Installations';
import { checkTimeTriggers } from '../api/Triggers';
import { loadCachedFormDataById } from '../api/Forms';

connectToParseServer(Settings.parse.serverUrl, Settings.parse.appId);

let navigator = null;
let initialRoute = { path: 'surveylist', title: 'Surveys' };
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
      isLoading: true,
      isAuthenticated: false,
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
    isAuthenticated((authenticated) => {
      if (authenticated) {
        checkTimeTriggers();
        checkDirtyObjects((err, res) => {
          if (err) {
            console.warn(err);
          }
          if (res) {
            console.log(res);
          }
          // set state after the check is complete
          this.setState({
            isAuthenticated: authenticated,
            isLoading: false,
          });
        });
      } else {
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
    // ask for permissions to push notifications
    if (Platform.OS === 'ios') {
      PushNotification.requestPermissions();
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
    if (platform === 'ios') {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
    upsertInstallation(token, platform, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  },

  /* Methods */
  setAuthenticated(authenticated) {
    this.setState({
      isAuthenticated: authenticated,
    }, () => {
      navigator.resetTo({path: 'surveylist', title: 'Surveys'});
    });
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
      if (navigator) {
        const routeStack = navigator.getCurrentRoutes();
        const currentRoutePath = routeStack[routeStack.length - 1].path;
        if (path !== currentRoutePath) {
          navigator.push({path: path, title: title});
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

    const sharedProps = {
      navigator: nav,
      logout: this.logoutHandler,
    };

    if (!this.state.isAuthenticated && !route.unsecured) {
      route.path = 'login';
      route.title = '';
    }

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
        viewComponent = <FormPage {...sharedProps} form={route.form} survey={route.survey} index={route.index} />;
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
        <Loading/>
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
