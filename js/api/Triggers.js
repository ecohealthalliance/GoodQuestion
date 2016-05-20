import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'


// Queries the connected Parse server for a list of Triggers.
export function loadTriggers(form, callback) {
  const formTriggerRelations = form.get('triggers')
  formTriggerRelations.query().find({
    success: function(results) {
      // TODO Cache triggers in Realm
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}