import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

import { loadQuestions } from '../api/Questions'
import { loadTriggers } from '../api/Triggers'


export function loadForms(options, callback) {
  const Form = Parse.Object.extend("Form")
  const query = new Parse.Query(Form)

  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " forms.")
      storeFormList(results)

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


export function storeFormList(list) {
  Store.forms = _.unionBy(Store.forms, list, 'id')
}