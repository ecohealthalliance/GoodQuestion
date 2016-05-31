/**
 * Good Question
 * @flow
 */

import React, { AppRegistry, PushNotificationIOS, Alert } from 'react-native'
import Parse from 'parse/react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'

// Router
import SharedNavigator from './js/router/SharedNavigator'

// Due to a bug in React Native, we must temporarily ignore propType warnings for some iOS components to work.
// Affected component: DatePickerIOS
//console.ignoredYellowBox = [
// 'Warning: Failed propType',
//]
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
    PushNotificationIOS.addEventListener('notification', this._onNotification);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
    PushNotificationIOS.addEventListener('register', this._onRegister);
  },

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
    PushNotificationIOS.removeEventListener('register', this._onRegister);
  },

  _onNotification(notification) {
    console.log('notification: ', notification);
    return;
  },

   _onLocalNotification(notification){
     console.log('notification: ', notification);
     return;
   },

   _onRegister(token) {
     console.log('token: ', token);
   },

  /* Render */
  render() {
    PushNotificationIOS.requestPermissions();
    return ( <SharedNavigator /> )
  }
})


AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
