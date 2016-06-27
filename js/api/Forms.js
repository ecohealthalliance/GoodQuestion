import { InteractionManager } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadQuestions } from './Questions'
import { loadTriggers, loadCachedTriggers } from './Triggers'
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
  const form = realm.objects('Form').filtered(`id = "${formId}"`)[0]
  const survey = realm.objects('Survey').filtered(`id = "${form.surveyId}"`)[0]
  return { form: form, survey: survey }
}

// Returns an object containing a form and its parent survey
export function loadCachedFormDataByGeofence(triggerId) {
  const trigger = realm.objects('GeofenceTrigger').filtered(`id = "${triggerId}"`)[0]
  const form = realm.objects('Form').filtered(`id = "${trigger.formId}"`)[0]
  const survey = realm.objects('Survey').filtered(`id = "${trigger.surveyId}"`)[0]
  return { form: form, survey: survey }
}

// Fetches the cached forms related to a specific survey
export function loadCachedForms(surveyId) {
  return realm.objects('Form').filtered(`surveyId = "${surveyId}"`)
}

export function loadActiveGeofenceFormsInRange(surveyId) {
  try {
    const triggers = realm.objects('GeofenceTrigger')
      .filtered(`surveyId = "${surveyId}" AND triggered == true AND completed == false AND inRange == true OR sticky == true`);

    let forms = [];
    const triggersLength = triggers.length;
    for (var i = 0; i < triggersLength; i++) {
      const triggerForms = Array.from(realm.objects('Form').filtered(`id = "${triggers[i].formId}"`));
      forms = _.unionBy(forms, triggerForms, 'id');
    }

    return forms;
  } catch (e) {
    alert(e)
    return [];
  }
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
  console.log(survey)
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



export function loadParseFormDataBySurveyId(surveyId, callback) {
  try {
  const Survey = Parse.Object.extend("Survey");
  const surveyQuery = new Parse.Query(Survey);
  // surveyQuery.equalTo("id", surveyId);
  
  // Query the Parse server for the target survey.
  surveyQuery.get(surveyId, {
    success: function(survey) {
      if (survey) {
        const surveyFormRelations = survey.get('forms');
        
        // Find the form relations of the survey.
        if (surveyFormRelations) {
          surveyFormRelations.query().ascending("createdAt").find({
            success: function(forms) {
              // If data was returned, prune the old cache and refresh with new data.
              clearCachedForms(surveyId);
              for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                let submission = realm.objects('Submission').filtered(`formId = "${form.id}"`);
                // Only include the current form if there have been no submissions to it yet.
                if (submission.length == 0) {
                  cacheParseForm(form, survey.id);
                  loadTriggers(form, survey);
                  loadQuestions(form, (err, questions)=>{
                    callback(null, forms, survey);
                  });
                }
              }
            },
            error: function(error, forms) {
              console.warn("Error: " + error.code + " " + error.message);
              if (callback) callback(error, forms, survey);
            }
          });
        } else {
          console.warn('No survey relations found with surveyId ' + surveyId);
        }
      } else {
        console.warn('No surveys found with id ' + surveyId);
        console.log(surveys)
      }
    },

    error: function(error) {
      console.warn("Error: " + error.code + " " + error.message);
      if (callback) callback(error);
    }


  })
  } catch(e) { console.warn(e)}
}

export function completeForm(formId) {
  console.log('COMPLETING FORM: ' + formId);

  const notification = realm.objects('Notification').filtered(`formId = "${formId}"`)[0]
  const timeTrigger = realm.objects('TimeTrigger').filtered(`formId = "${formId}"`)[0]
  const geofenceTrigger = realm.objects('GeofenceTrigger').filtered(`formId = "${formId}"`)[0]

  realm.write(() => {
    if (notification) notification.completed = true;
    if (timeTrigger) timeTrigger.completed = true;
    if (geofenceTrigger) geofenceTrigger.completed = true;
  });
}