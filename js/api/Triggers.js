import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'


// Queries the connected Parse server for a list of Triggers.
export function loadTriggers(form, callback) {
  const formTriggerRelations = form.get('triggers')
  formTriggerRelations.query().find({
    success: function(results) {
      storeTriggers(results)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

// Caches Trigger objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeTriggers(newTriggers) {
  if (!Array.isArray(newTriggers)) newTriggers = [newTriggers]
  Store.triggers = _.unionBy(Store.triggers, newTriggers, 'id')
}