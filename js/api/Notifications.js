import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'


// Cached variables
let toaster


// Finds and returns a list of pending Notifications from Realm
export function loadNotifications() {
  return realm.objects('Notification')
    .filtered(`complete == false`)
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

export function connectToaster(toaster) {

}

/**
 * Shows a toast at the bottom of the screen.
 * @param  {string} message  Text to be displayed on the toast
 * @param  {number} duration Time to keep the toast up
 * @param  {function} action Callback function to be exectued when tapping the toast
 */
export function showToast(message, duration, action) {
  
}