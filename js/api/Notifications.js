import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'


// Finds and returns the list of all surveys cached in Realm.io
export function loadNotifications() {
  return realm.objects('Notification')
}

// 
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