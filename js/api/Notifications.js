import { Platform, AppState } from 'react-native';
import PushNotification from 'react-native-push-notification';
import pubsub from 'pubsub-js';

import Settings from '../settings';
import realm from '../data/Realm';
import Store from '../data/Store';

import { loadCachedFormDataById } from './Forms';
import { upsertInstallation } from './Installations';


/**
 * Configures and initializes the background notification service.
 */
export function initializeNotifications() {
  // Configure Push Notifications
  if (Platform.OS === 'android') {
    PushNotification.configure({
      senderID: Settings.senderID,
      onRegister: _onRegister,
      onNotification: _onNotification,
    });
  } else {
    PushNotification.requestPermissions();
    PushNotification.configure({
      onRegister: _onRegister,
      onNotification: _onNotification,
    });
  }

  // Cache count of new notifications in the Store
  const newNotifications = loadNotifications({newOnly: true});
  Store.newNotifications = newNotifications.length;
}

function _onRegister(registration) {
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
}

/**
 * Event fired when the user receives a push notification on the background or starts the app via a notification
 * @param  {object} notification Push Notification json object
 */
function _onNotification(notification) {
  if (typeof notification === 'undefined') {
    return;
  }
  console.log(`New notification received: ${notification.push_id}`);

  if (notification.hasOwnProperty('push_id') && notification.hasOwnProperty('data') && notification.data.hasOwnProperty('formId')) {

    const data = loadCachedFormDataById(notification.data.formId);
    if (typeof data === 'undefined' || typeof data.survey === 'undefined' || typeof data.form === 'undefined') {
      return;
    }

    addAppNotification({
      id: notification.push_id,
      surveyId: data.survey.id,
      formId: data.form.id,
      title: data.form.title,
      description: notification.message,
      time: new Date(),
    });

    if (notification.foreground) {
      if (AppState.currentState !== 'active') {
        const path = {path: 'form', title: data.survey.title, survey: data.survey, form: data.form, index: data.index};
        const routeStack = [
          {path: 'surveylist', title: 'Surveys'},
          path,
        ];
        if (Store.navigator) {
          Store.navigator.immediatelyResetRouteStack(routeStack);
        } else {
          Store.initialRouteStack = routeStack;
        }
      }
    }
  }
}

// Finds and returns a list of pending Notifications from Realm
export function loadNotifications(options = {}) {
  let filter = 'complete == false';
  filter += options.newOnly ? ' AND viewed == false' : '';

  return realm.objects('Notification').filtered(
    filter).sorted(
      'datetime', true);
}

/**
 * Marks shown notifications as having been first viewed by the user
 * @param  {array} notifications Array of Realm 'Notificaion' objects
 */
export function markNotificationsAsViewed(notifications) {
  const notificationLength = notifications.length;
  realm.write(() => {
    for (let i = 0; i < notificationLength; i++) {
      notifications[i].viewed = true;
    }
  });
}

/**
 * Deletes all current notifications from the Realm database
 */
export function clearNotifications() {
  const notifications = loadNotifications();
  realm.write(() => {
    realm.delete(notifications);
  });
}

/**
 * Deletes a single notification from the Realm database
 * @param  {object} notification Realm 'Notification' object to be marked
 */
export function clearNotification(notification) {
  try {
    if (notification) {
      realm.write(() => {
        realm.delete(notification);
      });
    }
  } catch (e) {
    console.warn('Invalid Notification object: ', notification);
  }
}

/**
 * Creates a new notification object to be viewed in-app
 * @param {string} notification             Object data to be recorded in Realm
 * @param {string} notification.surveyId    Unique ID for the Notification's target Survey
 * @param {string} notification.formId      Unique ID of the Notification's target Form
 * @param {string} notification.title       Title of the notification
 * @param {string} notification.description Description of the notification
 * @param {object} notification.time        Date object of when the notification was posted
 * @return {object}                         New Realm object of the type 'Notification'
 */
export function addAppNotification(notification) {
  if (!notification) {
    return;
  }
  try {
    let newNotification = null;
    realm.write(() => {
      newNotification = realm.create('Notification', {
        id: notification.id,
        surveyId: notification.surveyId,
        formId: notification.formId,
        title: notification.title,
        description: notification.description,
        datetime: notification.time,
      }, true);
    });
    Store.newNotifications++;
    pubsub.publish('onNotification', newNotification);
    return newNotification;
  } catch (e) {
    console.error(e);
    return null;
  }
}
