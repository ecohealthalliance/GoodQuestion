import { InteractionManager, Platform } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import realm from '../data/Realm'
import { loadAllAcceptedSurveys } from './Surveys'
import { loadAcceptedInvitations } from '../api/Invitations'
import { removeGeofenceById, setupGeofences, addGeofence } from '../api/Geofencing'

// Queries the connected Parse server for a list of Triggers.
export function loadTriggers(form, survey, callback) {
  const Form= Parse.Object.extend("Form")
  const query = new Parse.Query(Form)
  query.get(form.id, {
    success: function(form){
      const formTriggerRelations = form.get('triggers')
      formTriggerRelations.query().find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) {
            if (results[i].get('type') === 'datetime') {
              cacheTimeTrigger(results[i], form, survey);
            } else if (results[i].get('type') === 'geofence') {
              cacheGeofenceTrigger(results[i], form, survey);
            }
          }

          if (callback) callback(null, results)
        },
        error: function(error, results) {
          console.warn("Error: " + error.code + " " + error.message)
          if (callback) callback(error, results)
        }
      })
    }
  })
}

// Fetches the cached triggers related to a specific survey.
export function loadCachedTriggers(formId) {
  return realm.objects('TimeTrigger').filtered(`formId= "${formId}"`);
}

/**
 * Fetches all cached datetime triggers for the accepted surveys
 * @return {object}  Realm object containing an array of 'TimeTrigger' objects,
 */
export function loadCachedTimeTriggers(options = {}, callback) {
  loadAllAcceptedSurveys((err, response) => {
    if (err) {
      console.warn(err);
      callback(err, []);
      return
    }
    
    try {

      let triggers = [];
      let filter = '';
      let filterOptions = '';
      if (options.excludeCompleted) filterOptions += ' AND completed == false';
      if (options.excludeExpired) filterOptions += ' AND expired == false';
      if (options.includeOnlyTriggered) filterOptions += ' AND triggered == true';
      
      if (options.surveyId) {
        filter = `surveyId = "${options.surveyId}"${filterOptions}`;
        triggers = Array.from(realm.objects('TimeTrigger').filtered(filter));
      } else {
        const responseLength = response.length;
        for (var i = 0; i < responseLength; i++) {
          filter = `surveyId = "${response[i].id}"${filterOptions}`;
          let surveyTriggers = Array.from(realm.objects('TimeTrigger').filtered(filter));
          triggers = _.unionBy(triggers, surveyTriggers, 'id');
        }
      }
      
      callback(null, triggers);
    } catch (err) {
      callback(err, []);
    }
    
  })
}

/**
 * Fetches all cached geofence triggers for the accepted surveys
 * @return {object}  Realm object containing an array of 'GeofenceTrigger' objects,
 */
export function loadCachedGeofenceTriggers(options = {}, callback) {
  loadAllAcceptedSurveys((err, response) => {
    if (err) {
      console.warn(err);
      callback(err, []);
      return
    }
    
    let filter = '';
    let filterOptions = '';
    let triggers = [];
    if (options.excludeCompleted) filterOptions += ' AND completed == false';
    if (options.includeOnlyTriggered) filterOptions += ' AND triggered == true';

    if (options.surveyId) {
      filter = `surveyId = "${options.surveyId}"${filterOptions}`;
      triggers = Array.from(realm.objects('GeofenceTrigger').filtered(filter));
    } else {
      const responseLength = response.length;
      for (var i = 0; i < responseLength; i++) {
        filter = `surveyId = "${response[i].id}"${filterOptions}`;
        let surveyTriggers = Array.from(realm.objects('GeofenceTrigger').filtered(filter));
        triggers = _.unionBy(triggers, surveyTriggers, 'id');
      }
    }

    callback(null, triggers);
  })
}

// Saves a Form object from Parse into our Realm.io local database
export function cacheTimeTrigger(trigger, form, survey) {
  try {
    // InteractionManager.runAfterInteractions(() => {
      let datetime = new Date(trigger.get('properties').datetime)
      realm.write(() => {
        realm.create('TimeTrigger', {
          id: trigger.id,
          formId: form.id,
          surveyId: survey.id,
          title: form.get('title'),
          datetime: datetime,
        }, true)
      })
    // })
  } catch(e) {
    console.error(e)
  }
}

/**
 * Saves a geofence 'Trigger' object from Parse into our Realm.io local database
 * @param  {object} trigger Parse 'Trigger' object.
 * @param  {object} form    Parse 'Form' object.
 * @param  {object} survey  Parse 'Survey' object.
 */
export function cacheGeofenceTrigger(trigger, form, survey) {
  try {
    let newTrigger = {
      id: trigger.id,
      formId: form.id,
      surveyId: survey.id,

      title: form.get('title'),
      latitude: trigger.get('properties').latitude,
      longitude: trigger.get('properties').longitude,
      radius: trigger.get('properties').radius || 10,

      updateTimestamp: Date.now(),
    };
    realm.write(() => {
      realm.create('GeofenceTrigger', newTrigger, true);
    });
    addGeofence(newTrigger);
  } catch(e) {
    console.warn(e);
  }
}

/**
 * Checks the time triggers of all accepted surveys
 * @param  {bool} omitNotifications   Set to true to prevent Notifications from being generated when the triggers become active
 */
export function checkTimeTriggers(omitNotifications) {
  loadAcceptedInvitations((err, invitations) => {
    if (err) {
      console.warn(err);
      return;
    }
    if (invitations && invitations.length > 0 ) {
      const surveyIds = invitations.map((invitation) => invitation.surveyId);
      const surveys = realm.objects('Survey').filtered(surveyIds.map((id) => `id == "${id}"`).join(' OR '));
      for (var i = 0; i < surveys.length; i++) {
        checkSurveyTimeTriggers(surveys[i], omitNotifications)
      }
    }
  });
}

/**
 * Checks the time triggers of a single survey.
 * @param  {ibject} survey            Realm 'Survey' object to be checked
 * @param  {bool} omitNotifications   Set to true to prevent Notifications from being generated when the triggers become active
 */
export function checkSurveyTimeTriggers(survey, omitNotifications) {
  let triggers = realm.objects('TimeTrigger').filtered(`surveyId="${survey.id}" AND triggered == false`)
  let now = new Date()

  // Make the expiration date 90 days
  let past = new Date()
  past = past.setDate(past.getDate() - 90)

  // Record the new trigger
  const triggerLength = triggers.length
  realm.write(() => {
    for (var i = 0; i < triggerLength; i++) {
      if (triggers[i] && triggers[i].datetime < now && triggers[i].datetime > past) {
        let activeTrigger = realm.create('TimeTrigger', {
          id: triggers[i].id,
          triggered: true,
        }, true)

        if (!omitNotifications) {
          const notification = realm.create('Notification', {
            surveyId: activeTrigger.surveyId,
            formId: activeTrigger.formId,
            title: activeTrigger.title,
            description: 'A scheduled survey form is available.', // TODO Replace with more descriptive messages in the future.
            datetime: activeTrigger.datetime,
          }, true);

        }
      }
    }
  });
}

/**
 * Removes triggers from Realm cache of a specified Survey
 * @param  {string} surveyId The ID of the target survey
 */
export function removeTriggers(surveyId) {
  const timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId="${surveyId}"`);
  const geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId="${surveyId}"`);
  const geofenceTriggersLength = geofenceTriggers.length;

  for (var i = geofenceTriggersLength - 1; i >= 0; i--) {
    if (geofenceTriggers[i]) {
      removeGeofenceById(geofenceTriggers[i].id);
    }
  }

  realm.write(() => {
    realm.delete(timeTriggers);
    realm.delete(geofenceTriggers);
  });
}