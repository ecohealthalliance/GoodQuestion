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

//gets the parse survey so we can call loadForms with it.  Handles the disconnect between realm and parse.  We should eventually refactor this
export function parseLoadFormsShim(survey){
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)
  query.get(survey.id, {
    sucess: function(survey){
      console.log("calling loadForms from shim")
      console.log(survey)
      loadForms(survey)
    },
    error: function(object, error){
      console.log("Error in parseLoadFormsShim")
      console.log(error)
    }
  })
}


// Loads Form data from a single Survey and retuns it via callback after the related questions have also been fetched.
export function loadForms(survey, callback) {
  console.log('inside loadForms')
  const surveyFormRelations = survey.get('forms')

  if (surveyFormRelations) {
    surveyFormRelations.query().ascending("createdAt").find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) {
          cacheParseForm(results[i], survey.id)
          loadTriggers(results[i], survey)
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
