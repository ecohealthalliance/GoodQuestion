import Realm from 'realm';

// Models
import Submission from '../models/Submission';
import Invitation from '../models/Invitation';
import Survey from '../models/Survey';
import Form from '../models/Form';
import Question from '../models/Question';
import Notification from '../models/Notification';
import TimeTrigger from '../models/TimeTrigger';
import GeofenceTrigger from '../models/GeofenceTrigger';
import Test from '../models/Test';

const realmInstance = new Realm({
  schemaVersion: 61,
  schema: [
    Survey,
    Form,
    Question,
    Notification,
    TimeTrigger,
    GeofenceTrigger,
    Submission,
    Invitation,
    Test,
  ],
});

/**
 * Erases the current cache of a target object
 * @param  {string} objectName   Realm object to search for and delete
 * @param  {array}  idExclusions Array of strings containing ids to be ignored by the function
 */
export function clearRealmCache(objectName, idExclusions) {
  try {
    const objects = realmInstance.objects(objectName);
    const expiredItems = [];
    const excludedIds = [];
    for (let i = 0; i < idExclusions.length; i++) {
      excludedIds.push(idExclusions[i].id);
    }

    // Standard JS array.filter doesn't work with these Realm objects, so we have to take care of this filtering manually.
    // Current version of Realm.io does not support exclusion queries for strings.
    for (let i = objects.length - 1; i >= 0; i--) {
      let expired = true;
      for (let j = excludedIds.length - 1; j >= 0; j--) {
        if (objects[i].id === excludedIds[j]) {
          expired = false;
        }
      }
      if (expired) {
        expiredItems.push(objects[i]);
      }
    }

    realmInstance.write(() => {
      realmInstance.delete(expiredItems);
    });
  } catch (e) {
    console.error(e);
  }
}

export default realmInstance;
