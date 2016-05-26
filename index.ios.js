/**
 * Good Question
 * @flow
 */

import React, { AppRegistry, PushNotificationIOS, Alert } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'

// Router
import SharedNavigator from './js/router/SharedNavigator'

// Due to a bug in React Native, we must temporarily ignore propType warnings for some iOS components to work.
// Affected component: DatePickerIOS
console.ignoredYellowBox = [
  'Warning: Failed propType',
]

/* iOS App */
const GoodQuestion = React.createClass ({
  /* Life Cycle */
  getInitialState() {
    return {
      store: Store
    }
  },

  componentWillMount() {
    PushNotificationIOS.addEventListener('notification', this._onNotification);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
  },

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  },

  _onNotification(notification) {
    return;
  },

   _onLocalNotification(notification){
     return;
   },

  /* Render */
  render() {
    PushNotificationIOS.requestPermissions();
    return ( <SharedNavigator /> )
  }
})


AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
