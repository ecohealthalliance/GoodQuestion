import _ from 'lodash'
import Parse from 'parse/react-native'
import realm from '../data/Realm'



// Queries the connected Parse server for a list of Triggers.
export function loadTriggers(form, callback) {
  const formTriggerRelations = form.get('triggers')
  formTriggerRelations.query().find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].get('type') === 'datetime') {
          cacheTimeTrigger(results[i], form)
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

// Saves a Form object from Parse into our Realm.io local database
function cacheTimeTrigger(trigger, form) {
  try {
    let datetime = trigger.get('datetime')
    realm.write(() => {
      realm.create('TimeTrigger', {
        formId: form.id,
        datetime: trigger.get('datetime'),
        triggered: false,
      }, true)
    })
  } catch(e) {
    console.error(e)
  }
}

export function checkDailyTimeTriggers() {
  let forms = realm.objects('Form')
  let now = Date.now() // timestamp in millis
  newActivations = []
  for (var i = 0; i < forms.length; i++) {
    if (forms[i])
    forms[i]
  }
}