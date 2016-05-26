import { InteractionManager } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import realm from '../data/Realm'
import { PushNotificationIOS } from 'react-native'

// Queries the connected Parse server for a list of Triggers.
export function loadTriggers(form, survey, callback) {
  const formTriggerRelations = form.get('triggers')
  formTriggerRelations.query().find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].get('type') === 'datetime') {
          cacheTimeTrigger(results[i], form, survey)
        } else {
          // TODO Create/Cache Geofence trigger
        }
      }
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

// Fetches the cached forms related to a specific survey
export function loadCachedTrigger(formId) {
  console.log(formId);
  return realm.objects('TimeTrigger').filtered(`formId= "${formId}"`)
}

// Saves a Form object from Parse into our Realm.io local database
function cacheTimeTrigger(trigger, form, survey) {
  try {
    // InteractionManager.runAfterInteractions(() => {
      let datetime = new Date(trigger.get('properties').datetime)
      realm.write(() => {
        realm.create('TimeTrigger', {
          id: trigger.id,
          formId: form.id,
          surveyId: survey.id,
          title: form.get('title'),
          datetime: datetime,
        }, true)
      })
    // })
  } catch(e) {
    console.error(e)
  }
}


// Checks for any time triggers activating in this cycle.
export function checkTimeTriggers() {
  let now = new Date()

  // Make the cut-off date 3 days
  let past = new Date()
  past = past.setDate(past.getDate() - 3)

  // The JavaScript version of Realm does not seem to support Date queries yet, the filtering has to be done manually.
  let triggers = realm.objects('TimeTrigger').filtered(`triggered == false`)
  let validTriggers = []
  let surveyId = ''
  let surveyAccepted = false
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].datetime < now && triggers[i].datetime > past) {
      if (triggers[i].surveyId !== surveyId) {
        let survey = realm.objects('Survey').filtered(`id == "${triggers[i].surveyId}"`)[0]
        if (survey) {
          surveyId = survey.id
          surveyAccepted = survey.status === 'accepted'
        } else {
          surveyAccepted = false
        }
      }
      if (surveyAccepted) {
        validTriggers.push(triggers[i])
      }
    }
  }

  realm.write(() => {
    for (var i = 0; i < validTriggers.length; i++) {
      realm.create('TimeTrigger', {
        id: validTriggers[i].id,
        triggered: true,
      }, true)

      const notification = realm.create('Notification', {
        formId: validTriggers[i].formId,
        title: validTriggers[i].title,
        description: 'A scheduled survey form is available.', // TODO Replace with more descriptive messages in the future.
        datetime: validTriggers[i].datetime,
      }, true);

      PushNotificationIOS.presentLocalNotification({
        alertBody: notification.description,
        applicationIconBadgeNumber: 1
      });

    }
  });

}
