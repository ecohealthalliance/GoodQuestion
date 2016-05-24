import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'


// Finds and returns a list of pending Notifications from Realm
export function loadNotifications() {
  return realm.objects('Notification').filtered(`complete == false`)
}

// Creates a new notification for an active Time Trigger
export function addTimeTriggerNotification( formId, title, description ) {
  try {
    realm.write(() => {
      realm.create('Notification', {
        formId: formId,
        title: title,
        description: description,
      }, true)
    })
  } catch(e) {
    console.error(e)
  }
}