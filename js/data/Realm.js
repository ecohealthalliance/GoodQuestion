import Realm from 'realm';

// Models
import Submission from '../models/Submission'
import Survey from '../models/Survey'
import Form from '../models/Form'
import Question from '../models/Question'
import Notification from '../models/Notification'
import TimeTrigger from '../models/TimeTrigger'
import GeofenceTrigger from '../models/GeofenceTrigger'

const realmInstance = new Realm({
  schema: [
    Survey,
    Form,
    Question,
    Notification,
    TimeTrigger,
    GeofenceTrigger,
    Submission,
  ],
  schemaVersion: 41,
})

// Erases the current cache of a target object
export function clearRealmCache(objectName, idExclusions) {
  try {
    let objects = realm.objects(objectName)
    let expiredSurveys = []
    let excludedIds = []
    for (var i = 0; i < idExclusions.length; i++) {
      excludedIds.push(idExclusions[i].id)
    }

    // Standard JS array.filter doesn't work with these Realm objects, so we have to take care of this filtering manually.
    // Current version of Realm.io does not support exclusion queries for strings.
    for (var i = objects.length - 1; i >= 0; i--) {
      let expired = true
      for (var j = excludedIds.length - 1; j >= 0; j--) {
        if (objects[i].id === excludedIds[j]) expired = false
      }
      if (expired) expiredSurveys.push(objects[i])
    }

    realm.write(() => {
      realm.delete(expiredSurveys)
    })
  } catch (e) {
    console.error(e)
  }
}

export default realmInstance;
