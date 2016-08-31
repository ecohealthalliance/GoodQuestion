import _ from 'lodash';
import Parse from 'parse/react-native';
import realm from '../data/Realm';

import { InvitationStatus, loadCachedInvitation } from './Invitations';
import { loadQuestions } from './Questions';
import { loadTriggers } from './Triggers';

// Saves a Form object from Parse into our Realm.io local database
export function cacheParseForm(form, surveyId) {
  try {
    realm.write(() => {
      realm.create('Form', {
        id: form.id,
        surveyId: surveyId,
        order: form.get('order'),
        title: form.get('title'),
      }, true);
    });
  } catch (e) {
    console.error(e);
  }
}

// Returns an object containing a form and its parent survey
export function loadCachedFormDataById(formId) {
  const form = realm.objects('Form').filtered(`id = "${formId}"`)[0];
  if (!form) {
    console.warn(`Error: No form data found with the id: ${formId}`);
    return;
  }
  const forms = realm.objects('Form').filtered(`surveyId = "${form.surveyId}"`).sorted('order');
  const index = forms.findIndex((f) => {
    return f.id === form.id;
  });
  const survey = realm.objects('Survey').filtered(`id = "${form.surveyId}"`)[0];
  return { form: form, survey: survey, index: index };
}

// Returns an object containing a form and its parent survey
export function loadCachedFormDataByTriggerId(triggerId, type) {
  const triggerObjectType = type === 'geofence' ? 'GeofenceTrigger' : 'TimeTrigger';
  const trigger = realm.objects(triggerObjectType).filtered(`id = "${triggerId}"`)[0];
  const form = realm.objects('Form').filtered(`id = "${trigger.formId}"`)[0];
  const survey = realm.objects('Survey').filtered(`id = "${trigger.surveyId}"`)[0];
  return { form: form, survey: survey };
}

// Fetches the cached forms related to a specific survey
export function loadCachedForms(surveyId) {
  return realm.objects('Form').filtered(`surveyId = "${surveyId}"`);
}

export function loadActiveGeofenceFormsInRange(surveyId) {
  try {
    const triggers = realm.objects('GeofenceTrigger').filtered(`surveyId = "${surveyId}" AND triggered == true AND completed == false AND inRange == true OR sticky == true`);

    let forms = [];
    const triggersLength = triggers.length;
    for (let i = 0; i < triggersLength; i++) {
      const triggerForms = Array.from(realm.objects('Form').filtered(`id = "${triggers[i].formId}"`));
      forms = _.unionBy(forms, triggerForms, 'id');
    }

    return forms;
  } catch (e) {
    console.warn(e);
    return [];
  }
}

export function clearCachedForms(surveyId) {
  const formsToDelete = realm.objects('Form').filtered(`surveyId = "${surveyId}"`);
  realm.write(() => {
    realm.delete(formsToDelete);
  });
  return;
}

// Loads Form data from a single Survey and retuns it via callback after the related questions have also been fetched.
export function loadForms(survey, callback) {
  clearCachedForms(survey.id);
  const surveyFormRelations = survey.get('forms');
  if (surveyFormRelations) {
    surveyFormRelations.query().ascending('createdAt').find({
      success: (results) => {
        const numResults = results.length;
        for (let i = 0; i < numResults; i++) {
          const form = results[i];
          const submission = realm.objects('Submission').filtered(`formId = "${form.id}"`);
          // Only include the current form if there have been no submissions to it yet.
          if (submission.length === 0) {
            cacheParseForm(form, survey.id);
          }
        }
        if (callback) {
          callback(null, results, survey);
        }
      },
      error: (error, results) => {
        console.warn(`Error: ${error.code} ${error.message}`);
        if (callback) {
          callback(error, results, survey);
        }
      },
    });
  } else {
    console.warn('Error: Unable to find relation "forms" for Survey object.');
  }
}

/**
 * determines if the surveyId has an accepted invitation for the current user.
 *
 * @param {string} surveyId, the survey id from the cache
 */
export function getFormAvailability(surveyId, done) {
  const result = {
    availableTimeTriggers: 0,
    nextTimeTrigger: false,
    geofenceTriggersInRange: 0,

    currentTrigger: null,
    currentTriggerType: '',
  };
  loadCachedInvitation(surveyId, (err, invitation) => {
    if (err) {
      console.warn(err);
      done(err, result);
      return;
    }
    if (invitation && invitation.status === InvitationStatus.ACCEPTED) {
      try {
        // Check for availability on pending time triggers.
        const timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId="${surveyId}"`);
        const availableTimeTriggers = timeTriggers.filtered('triggered == true AND completed == false').sorted('datetime');
        if (availableTimeTriggers && availableTimeTriggers.length > 0) {
          result.availableTimeTriggers = availableTimeTriggers.length;
          result.currentTrigger = availableTimeTriggers[0];
          result.currentTriggerType = 'datetime';
        }

        // Check for the closest future time trigger.
        const nextTimeTriggers = timeTriggers.filtered('triggered == false').sorted('datetime');
        if (nextTimeTriggers && nextTimeTriggers.length > 0) {
          result.nextTimeTrigger = nextTimeTriggers[0].datetime;
        }

        // Check for active geofence triggers.
        const geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId="${surveyId}"`);
        if (geofenceTriggers && geofenceTriggers.length > 0) {
          const geofenceTriggersInRange = geofenceTriggers.filtered('triggered == true AND completed == false AND inRange == true OR sticky == true');
          result.geofenceTriggersInRange = geofenceTriggersInRange.length;
          result.currentTrigger = geofenceTriggersInRange[0];
          result.currentTriggerType = 'geofence';
        }
      } catch (e) {
        console.warn(e);
      }
    }
    done(null, result);
  });
}

/**
 * Loads Form data from Parse, then caches it.
 * Also collects and caches Question/Trigger data related to those forms.
 * @param  {string}   surveyId ID of the Survey stored in the Parse server.
 * @param  {Function} callback Callback function to return after Questions for each form have been updated. Can return multiple times to update components.
 */
export function loadParseFormDataBySurveyId(surveyId, callback) {
  const Survey = Parse.Object.extend('Survey');
  const surveyQuery = new Parse.Query(Survey);

  // Query the Parse server for the target survey.
  surveyQuery.get(surveyId, {
    success: (survey) => {
      if (survey) {
        const surveyFormRelations = survey.get('forms');

        // Find the form relations of the survey.
        if (surveyFormRelations) {
          surveyFormRelations.query().ascending('createdAt').find({
            success: (forms) => {
              // If data was returned, prune the old cache and refresh with new data.
              clearCachedForms(surveyId);
              for (let i = 0; i < forms.length; i++) {
                const form = forms[i];
                const submission = realm.objects('Submission').filtered(`formId = "${form.id}"`);
                // Only include the current form if there have been no submissions to it yet.
                if (submission.length === 0) {
                  cacheParseForm(form, survey.id);
                  loadTriggers(form, survey);
                  loadQuestions(form, (err, questions) => {
                    callback(null, forms, survey, questions);
                  });
                }
              }
            },
            error: (error, forms) => {
              console.warn(`Error: ${error.code} - ${error.message}`);
              if (callback) {
                callback(error, forms, survey);
              }
            },
          });
        } else {
          console.warn(`No survey relations found with surveyId ${surveyId}`);
        }
      } else {
        console.warn(`No surveys found with id ${surveyId}`);
      }
    },

    error: (error) => {
      console.warn(`Error: ${error.code} - ${error.message}`);
      if (callback) {
        callback(error);
      }
    },
  });
}

/**
 * Tags notifications and triggers as completed after a form has been filled.
 * @param  {string} formId ID of the completed form
 */
export function completeForm(formId) {
  console.log(`COMPLETING FORM: ${formId}`);

  try {
    const notification = realm.objects('Notification').filtered(`formId = "${formId}"`)[0];
    const timeTrigger = realm.objects('TimeTrigger').filtered(`formId = "${formId}"`)[0];
    const geofenceTrigger = realm.objects('GeofenceTrigger').filtered(`formId = "${formId}"`)[0];

    realm.write(() => {
      if (notification) {
        realm.delete(notification);
      }
      if (timeTrigger) {
        timeTrigger.completed = true;
      }
      if (geofenceTrigger) {
        geofenceTrigger.completed = true;
      }
    });
  } catch (e) {
    console.warn(e);
  }
}
