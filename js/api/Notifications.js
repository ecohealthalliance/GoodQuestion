import { Platform, AppState, Vibration } from 'react-native';
import PushNotification from 'react-native-push-notification';
import pubsub from 'pubsub-js';
import async from 'async';

import Settings from '../settings';
import realm from '../data/Realm';
import Store from '../data/Store';
import Color from '../styles/Color';

import { ToastChannels, ToastMessage } from '../models/messages/Toast';
import { NotificationChannels, NotificationMessage } from '../models/messages/Notification';
import { currentUser } from './Account';
import { loadCachedFormDataById, loadCachedFormDataByTriggerId } from './Forms';
import { upsertInstallation } from './Installations';


/**
 * Creates a new notification object to be viewed in-app
 * @param {object} notification             Object data to be recorded in Realm
 * @param {string} notification.surveyId    Unique ID for the Notification's target Survey
 * @param {string} notification.formId      Unique ID of the Notification's target Form
 * @param {string} notification.formId      Unique ID of the Notification's related Trigger object
 * @param {string} notification.title       Title of the notification
 * @param {string} notification.message     Message of the notification
 * @param {date} notification.time        Date object of when the notification was posted
 * @return {object}                         New Realm object of the type 'Notification'
 */
export function addAppNotification(notification) {
  if (!notification) {
    return;
  }
  try {
    let newNotification = null;
    currentUser((err, user) => {
      if (err) {
        console.warn('Unable to add notification: User not found.');
        return;
      }

      realm.write(() => {
        newNotification = realm.create('Notification', {
          id: notification.id,
          surveyId: notification.surveyId || '',
          formId: notification.formId || '',
          triggerId: notification.triggerId || '',
          userId: notification.userId || user.id,
          title: notification.title,
          message: notification.message,
          createdAt: notification.time || new Date(),
        }, true);
      });

      Store.newNotifications++;

      // publish a message that a new notification was created
      const notificationMessage = NotificationMessage.createFromObject(newNotification);
      pubsub.publish(NotificationChannels.CREATE, notificationMessage);
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Sends a local notification to the user. Triggers only when the phone is in a background state.
 * @param  {string} message   Message to appear in the local push notificaiton.
 * @param  {string} formId    formId for the Form related to this notification object, if any.
 * @param  {bool}   vibrate   If set to true, the notification will also vibrate the user's device.
 */
export function notifyOnBackground(message, formId, vibrate) {
  if (AppState.currentState !== 'active') {
    if (Store.userSettings.notifyOnGeofence) {
      PushNotification.localNotification({
        message: message,
        formId: formId || '',
        collapse_key: 'goodquestion', // eslint-disable-line camelcase
      });
    }

    if (vibrate && Store.userSettings.vibrateOnGeofence) {
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 500, 200, 500]);
      } else {
        Vibration.vibrate();
      }
    }
  }
}

function handleNewNotification(notification) {
  async.auto({
    user: (cb) => {
      currentUser(cb);
    },
    data: (cb) => {
      let data = null;
      if (notification.data.formId) {
        data = loadCachedFormDataById(notification.data.formId);
      } else if (notification.data.triggerId) {
        data = loadCachedFormDataByTriggerId(notification.data.triggerId, 'datetime');
      }

      if (data) {
        cb(null, data);
      } else {
        cb(`Unable to find form data with id ${notification.data.formId}`);
      }
    },
    appNotification: ['user', 'data', (cb, results) => {
      const data = results.data;
      if (typeof data === 'undefined' || typeof data.survey === 'undefined' || typeof data.form === 'undefined' || typeof results.user === 'undefined') {
        return;
      }

      const userId = notification.userId || results.user.id;
      if (!userId) {
        console.warn(`Unable to find userId for notification ${notification.push_id}`);
        return;
      }

      addAppNotification({
        id: notification.id || notification.push_id,
        userId: userId,
        surveyId: data.survey.id,
        formId: data.form.id,
        title: data.survey.title,
        message: notification.message,
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

      cb();
    }],
  }, (err, results) => {
    if (err) {
      console.warn(err);
      return;
    }
    console.log(`Added notification: ${results.appNotification.id}`);
  });
}

function checkNotificationPermissions() {
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
}

/**
 * Event fired on initialization of the notification service.
 * @param  {object} registration Object containing data returned by the user's phone.
 */
function _onRegister(registration) {
  const token = registration.token;
  const platform = registration.os;
  if (platform === 'ios') {
    checkNotificationPermissions();
    PushNotification.setApplicationIconBadgeNumber(0);
  }
  upsertInstallation(token, platform, (err) => {
    if (err) {
      console.warn(err);
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
    handleNewNotification(notification);
  }
}

/**
 * // Finds and returns a list of pending Notifications from the Realm database.
 * @param  {object} options           Object containing filter options for the Realm query.
 * @param  {object} options.newOnly   If true, will filter out all Notification objects that have been viewed already.
 * @return {object}                   Realm object conatining a list of 'Notification' objects.
 */
export function loadNotifications(options = {}) {
  let filter = 'completed == false';
  filter += options.newOnly ? ' AND viewed == false' : '';

  return realm.objects('Notification')
                .filtered(filter)
                .sorted('createdAt', true);
}

/**
 * Finds a list of pending Notifications for the current user and returns it via callback.
 * @param  {Object} options    Object containing filter options for loadNotifications().
 */
export function loadUserNotifications(options = {}, callback) {
  currentUser((err, user) => {
    if (err) {
      callback(err);
      return;
    }
    const userNotifications = loadNotifications({...options, userId: user.id});
    callback(null, userNotifications);
  });
}

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
    PushNotification.configure({
      onRegister: _onRegister,
      onNotification: _onNotification,
    });
  }

  // Cache count of new notifications in the Store
  loadUserNotifications({newOnly: true}, (err, notifications) => {
    if (err || !notifications) {
      return;
    }
    Store.newNotifications = notifications.length;
  });
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
  loadUserNotifications({}, (err, notifications) => {
    if (err) {
      console.warn(err);
      return;
    }
    realm.write(() => {
      realm.delete(notifications);
    });
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
 * Shows a toast at the bottom of the screen.
 * @param  {string} title    Title text to be displayed on the toast
 * @param  {string} message  Description text to be displayed on the toast
 * @param  {string} icon     FA icon to be shown on the toast
 * @param  {number} duration Time to keep the toast up
 * @param  {function} action Callback function to be executed when tapping the toast
 */
export function showToast(title, message, icon, duration, action) {
  // only show a toastMessage if the user is logged in
  currentUser((err, user) => {
    if (err || user === null) {
      return;
    }
    const toastMessage = ToastMessage.createFromObject({
      title: title,
      message: message,
      icon: icon,
      iconColor: Color.faded,
      duration: duration,
      action: action,
    });
    pubsub.publish(ToastChannels.SHOW, toastMessage);
  });
}
