import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

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
  console.log("GOT NOTIFICATION");
  console.log(notification);
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
    if (notification.foreground) {
      Store.newNotifications++;
      if (this._header) {
        this._header.updateNotifications();
      }
      if (this._controlPanel) {
        this._controlPanel.updateNotifications();
      }
    } else {
      if (Store.navigator) {
        Store.navigator.resetTo(path);
      } else {
        Store.initialRoute = path;
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
 * Deletes all current notifications
 * @return {[type]} [description]
 */
export function clearNotifications() {
  const notifications = loadNotifications();
  realm.write(() => {
    realm.delete(notifications);
  });
}

// Creates a new notification for an active Time Trigger
export function addTimeTriggerNotification(surveyId, formId, title, description, time) {
  try {
    realm.write(() => {
      realm.create('Notification', {
        surveyId: surveyId,
        formId: formId,
        title: title,
        description: description,
        datetime: time,
      }, true);
    });
  } catch (e) {
    console.error(e);
  }
}
