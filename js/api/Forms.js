import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadQuestions } from './Questions'
import { loadTriggers } from './Triggers'


// Saves a Form object from Parse into our Realm.io local database
export function cacheParseForm(form, surveyId) {
  realm.write(() => {
    try {
      realm.create('Form', {
        id: form.id,
        surveyId: surveyId,
        order: form.get('order'),
        title: form.get('title'),
      }, true)
    } catch(e) {
      console.error(e)
    }
  })
}

// Loads Form data from a single Survey and retuns it via callback after the related questions have also been fetched.
export function loadForms(survey, callback) {
  const surveyFormRelations = survey.get('forms')
  if (surveyFormRelations) {
    surveyFormRelations.query().find({
      success: function(results) {
        storeForms(results)
        for (var i = 0; i < results.length; i++) {
          cacheParseForm(results[i], survey.id)
          loadQuestions(results[i])
        }
        if (callback) callback(null, results, survey)
      },
      error: function(error, results) {
        console.warn("Error: " + error.code + " " + error.message)
        if (callback) callback(error, results, survey)
      }
    })
  } else {
    console.warn("Error: Unable to find relation \"forms\" for Survey object." )
  }
}

// Caches Form objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeForms(newForms) {
  if (!Array.isArray(newForms)) newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}