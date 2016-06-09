/**
 * Good Question
 */

import React, { AppRegistry } from 'react-native'
import Parse from 'parse/react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'

// Router
import SharedNavigator from './js/router/SharedNavigator'

import { upsertInstallation } from './js/api/Installations'

import Settings from './js/settings'
import PushNotification from 'react-native-push-notification';

console.disableYellowBox = true;

/* Android App */
const GoodQuestion = React.createClass ({
  /* Life Cycle */
  getInitialState() {
    return {
      store: Store
    }
  },

  componentWillMount() {
    PushNotification.configure({
      senderID: Settings.senderID,
      onRegister: this._onRegister,
      onNotification: this._onNotification,
    });
  },

  _onNotification(notification) {
    console.log('notification: ', notification);
  },

  _onRegister(registration) {
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
    return ( <SharedNavigator /> )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
