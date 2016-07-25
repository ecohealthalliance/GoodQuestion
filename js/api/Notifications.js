import { Platform, AppState } from 'react-native';
import PushNotification from 'react-native-push-notification';
import pubsub from 'pubsub-js';

import Settings from '../settings';
import realm from '../data/Realm';
import Store from '../data/Store';

import { loadCachedFormDataById } from './Forms';
import { upsertInstallation } from './Installations';


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

  // Store count of new notifications
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

function _onNotification(notification) {
  if (typeof notification === 'undefined') {
    return;
  }
  console.log(`New notification received: ${notification.push_id}`);

  if (notification.hasOwnProperty('data') && notification.data.hasOwnProperty('formId')) {

    const data = loadCachedFormDataById(notification.data.formId);
    if (typeof data === 'undefined' || typeof data.survey === 'undefined' || typeof data.form === 'undefined') {
      return;
    }
    const path = {path: 'form', title: data.survey.title, survey: data.survey, form: data.form, index: data.index};
    const appNotification = addAppNotification(data.survey.id, data.form.id, data.form.title, notification.message, new Date());

    if (notification.foreground) {
      if (AppState.currentState === 'active') {
        Store.newNotifications++;
        pubsub.publish('onNotification', appNotification);
      } else {
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

export function markNotificationsAsViewed(notifications) {
  const notificationLength = notifications.length;
  realm.write(() => {
    for (let i = 0; i < notificationLength; i++) {
      notifications[i].viewed = true;
    }
  });
}

/**
 * Marks notifications as completed
 */
export function clearNotifications() {
  const notifications = loadNotifications();
  realm.write(() => {
    for (let i = 0; i < notifications.length; i++) {
      notifications[i].complete = true;
    }
  });
}

/**
 * Marks a single notification as completed
 * @param  {object} notification Realm 'Notification' object to be marked
 */
export function clearNotification(notification) {
  try {
    realm.write(() => {
      notification.complete = true;
    });
  } catch(e) {
    console.warn('Invalid Notification object: ', notification);
  }
}

/**
 * Creates a new notification object to be viewed in-app
 * @param {string} surveyId    Unique ID for the target Survey
 * @param {string} formId      Unique ID of the target Form
 * @param {string} title       Title of the notification
 * @param {string} description Description of the notification
 * @param {object} time        Date object of when the notification was posted
 */
export function addAppNotification(surveyId, formId, title, description, time) {
  try {
    const newNotification = {
      surveyId: surveyId,
      formId: formId,
      title: title,
      description: description,
      datetime: time,
    };
    realm.write(() => {
      realm.create('Notification', newNotification, true);
    });
    return newNotification;
  } catch (e) {
    console.error(e);
    return null;
  }
}