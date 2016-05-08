import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

import { loadQuestions } from './Questions'
import { loadTriggers } from './Triggers'


// Loads Form data from a single Survey and retuns it via callback after the related questions have also been fetched.
export function loadForms(survey, callback) {
  const surveyFormRelations = survey.get('forms')
  surveyFormRelations.query().find({
    success: function(results) {
      storeForms(results)
      if (callback) callback(null, results, survey)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results, survey)
    }
  })
}

// Caches Form objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeForms(newForms) {
  if (!Array.isArray(newForms)) newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}