import { 
  Platform,
  Vibration,
  AppState,
} from 'react-native';

import _ from 'lodash';
import Parse from 'parse/react-native';
import Store from '../data/Store';
import realm from '../data/Realm';
import pubsub from 'pubsub-js';

import Color from '../styles/Color';
import {ToastAddresses, ToastMessage} from '../models/ToastMessage';
import { loadForms } from './Forms';

import PushNotification from 'react-native-push-notification';


// Finds and returns a list of pending Notifications from Realm
export function loadNotifications() {
  return realm.objects('Notification')
    .filtered(`completed == false`)
    .sorted('datetime', true)
}

// Creates a new notification for an active Time Trigger
export function addTimeTriggerNotification( surveyId, formId, title, description, time ) {
  try {
    realm.write(() => {
      realm.create('Notification', {
        surveyId: surveyId,
        formId: formId,
        title: title,
        description: description,
        datetime: time,
      }, true)
    })
  } catch(e) {
    console.error(e)
  }
}

/**
 * Shows a toast at the bottom of the screen.
 * @param  {string} title    Title text to be displayed on the toast
 * @param  {string} message  Description text to be displayed on the toast
 * @param  {string} icon     FA icon to be shown on the toast
 * @param  {number} duration Time to keep the toast up
 * @param  {function} action Callback function to be executed when tapping the toast
 */
export function showToast(title, message, icon, duration, action) {
  const toastMessage = ToastMessage.createFromObject({
    title: title,
    message: message,
    icon: icon,
    iconColor: Color.faded,
    duration: duration,
    action: action,
  });
  pubsub.publish(ToastAddresses.SHOW, toastMessage);
}



export function notificateOnBackground(message, vibrate) {
  // Notify with sound
  console.log(AppState.currentState)

  if (AppState.currentState != 'active') {
    PushNotification.localNotification({
      message: message,
    });
  }

  if (vibrate) {
    Vibration.vibrate([0, 500, 200, 500]);
  }
}
