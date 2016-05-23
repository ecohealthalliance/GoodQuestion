import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'


// Finds and returns the list of all surveys cached in Realm.io
export function loadNotifications() {
  return realm.objects('Notification')
}