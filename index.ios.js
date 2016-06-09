/**
 * Good Question
 * @flow
 */

import React, { AppRegistry, PushNotificationIOS, Alert } from 'react-native'
import Parse from 'parse/react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'
import { upsertInstallation } from './js/api/Installations'

// Router
import SharedNavigator from './js/router/SharedNavigator'

const PushNotification = require('react-native-push-notification');


console.disableYellowBox = true;

/* iOS App */
const GoodQuestion = React.createClass ({
  /* Life Cycle */
  getInitialState() {
    return {
      store: Store
    }
  },

  componentWillMount() {
    PushNotification.configure({
      onRegister: this._onRegister,
      onNotification: this._onNotification,
    });
  },

  _onNotification(notification) {
    console.log('notification: ', notification);
  },

  _onRegister(registration) {
    console.log('registration: ', registration);
    const token = registration.token;
    const platform = registration.os;
    upsertInstallation(token, platform, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  },

  /* Render */
  render() {
    PushNotification.requestPermissions();
    return ( <SharedNavigator /> )
  }
})


AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
