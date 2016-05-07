import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

import { loadQuestions } from './Questions'
import { loadTriggers } from './Triggers'

// Queries the connected Parse server for a list of Triggers.
export function loadForms(surveys, callback) {
  console.log('forms 1')
  for (var i = 0; i < surveys.length; i++) {
    const surveyFormRelations = surveys[i].get('forms')
    surveyFormRelations.query().find({
      success: function(results) {
        storeForms(results)
        for (var i = 0; i < results.length; i++) {
          loadTriggers(results[i])
          loadQuestions(results[i])
        }
        if (callback) callback(null, results)
      },
      error: function(error, results) {
        console.warn("Error: " + error.code + " " + error.message)
        if (callback) callback(error, results)
      }
    })
  }
}

// Caches Form objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeForms(newForms) {
  if (!Array.isArray(newForms)) newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}