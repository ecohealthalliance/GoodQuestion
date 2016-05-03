import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'


export function loadTriggers(options, callback) {
  const Trigger = Parse.Object.extend("Trigger")
  const query = new Parse.Query(Trigger)

  query.find({
    success: function(results) {
      console.log("Retrieved " + results.length + " triggers.")
      storeTriggers(results)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      alert("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

export function storeTriggers(newTriggers) {
  if (!Array.isArray(newTriggers)) newTriggers = [newTriggers]
  Store.questions = _.unionBy(Store.triggers, newTriggers, 'id')
}