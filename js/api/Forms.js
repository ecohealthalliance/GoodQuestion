import { InteractionManager } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadQuestions } from './Questions'
import { loadTriggers } from './Triggers'
import Realm from 'realm';
import Submission from '../models/Submission';


// Saves a Form object from Parse into our Realm.io local database
export function cacheParseForm(form, surveyId) {
  // InteractionManager.runAfterInteractions(() => {
    try {
      realm.write(() => {
        let newForm = realm.create('Form', {
          id: form.id,
          surveyId: surveyId,
          order: form.get('order'),
          title: form.get('title'),
        }, true)
      })
    } catch(e) {
      console.error(e)
    }
  // })
}

// Returns an object containing a form and its parent survey
export function loadCachedFormDataById(formId) {
  let form = realm.objects('Form').filtered(`id = "${formId}"`)[0]
  let survey = realm.objects('Survey').filtered(`id = "${form.surveyId}"`)[0]
  return { form: form, survey: survey }
}

// Fetches the cached forms related to a specific survey
export function loadCachedForms(surveyId) {
  return realm.objects('Form').filtered(`surveyId = "${surveyId}"`)
}

export function clearCachedForms(surveyId) {
  let formsToDelete = realm.objects('Form').filtered(`surveyId = "${surveyId}"`);
    realm.write(() => {
      realm.delete(formsToDelete)
    })
  return
}

// Loads Form data from a single Survey and retuns it via callback after the related questions have also been fetched.
export function loadForms(survey, callback) {
  clearCachedForms(survey.id)
  const surveyFormRelations = survey.get('forms')

  if (surveyFormRelations) {
    surveyFormRelations.query().ascending("createdAt").find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) {
          let form = results[i]
          let submission = realm.objects('Submission').filtered(`formId = "${form.id}"`)
          // Only include the current form if there have been no submissions to it yet.
          if(submission.length == 0){
            cacheParseForm(form, survey.id)
            loadTriggers(form, survey)
            loadQuestions(form)
          }
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
