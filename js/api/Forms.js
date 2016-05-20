import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

import { loadQuestions } from './Questions'
import { loadTriggers } from './Triggers'
import Realm from 'realm';
import Submission from '../models/Submission';


// Loads Form data from a single Survey and retuns it via callback after the related questions have also been fetched.
export function loadForms(survey, callback) {
  const surveyFormRelations = survey.get('forms')
  if (surveyFormRelations) {
    surveyFormRelations.query().find({
      success: function(results) {
        realm = new Realm({schema: [Submission]});
        newForms = []
        _.forEach(results, function(form, key){
          let submission = realm.objects('Submission').filtered(`formId = "${form.id}"`)
          // Only include the current form if there have been no submissions to it yet.
          if(submission.length == 0){
            newForms.push(form);
          }
        });
        storeForms(newForms)
        if (callback) callback(null, newForms, survey)
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
  Store.forms = newForms
  // Not sure we want to union the newForms with the old ones?
  // Store.forms = _.unionBy(Store.forms, newForms, 'id')
}