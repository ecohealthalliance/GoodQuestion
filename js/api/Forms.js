import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

import { loadQuestions } from './Questions'
import { loadTriggers } from './Triggers'


export function loadForms(options, callback) {
  const Form = Parse.Object.extend("Form")
  const query = new Parse.Query(Form)

  query.find({
    success: function(results) {
      console.log("Retrieved " + results.length + " forms.")
      storeForms(results)

      loadTriggers()
      loadQuestions()
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      alert("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}


export function storeForms(newForms) {
  if (!Array.isArray(newForms)) newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}