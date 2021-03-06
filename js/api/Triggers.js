import _ from 'lodash';
import async from 'async';
import Parse from 'parse/react-native';
import realm from '../data/Realm';
import { loadAcceptedInvitations } from '../api/Invitations';
import { addAppNotification } from '../api/Notifications';
import { loadAllAcceptedSurveys } from './Surveys';
import { removeGeofenceById, addGeofence } from '../api/Geofencing';

/**
 * Checks the time triggers of a single survey.
 * @param  {ibject} survey            Realm 'Survey' object to be checked
 * @param  {bool} omitNotifications   Set to true to prevent Notifications from being generated when the triggers become active
 */
export function checkSurveyTimeTriggers(survey, omitNotifications) {
  const triggers = realm.objects('TimeTrigger').filtered(`surveyId="${survey.id}" AND triggered == false`);
  const now = new Date();

  // Record the new trigger
  const triggerLength = triggers.length;
  const activeTriggers = [];
  realm.write(() => {
    for (let i = 0; i < triggerLength; i++) {
      if (triggers[i] && triggers[i].triggered === false && triggers[i].datetime < now) {
        const activeTrigger = realm.create('TimeTrigger', {
          id: triggers[i].id,
          triggered: true,
        }, true);
        activeTriggers.push(activeTrigger);
      }
    }
  });

  if (!omitNotifications) {
    for (let i = activeTriggers.length - 1; i >= 0; i--) {
      addAppNotification({
        id: activeTriggers[i].formId,
        surveyId: activeTriggers[i].surveyId,
        formId: activeTriggers[i].formId,
        title: activeTriggers[i].title,
        message: 'A new scheduled survey form is available.',
        time: activeTriggers[i].datetime,
      });
    }
  }
}

/**
 * Checks the time triggers of all accepted surveys
 * @param  {bool} omitNotifications   Set to true to prevent Notifications from being generated when the triggers become active
 */
export function checkTimeTriggers(omitNotifications, callback) {
  loadAcceptedInvitations((err, invitations) => {
    if (err) {
      console.warn(err);
      if (callback) {
        callback(err);
      }
      return;
    }
    if (invitations && invitations.length > 0) {
      const surveyIds = invitations.map((invitation) => invitation.surveyId);
      const surveys = realm.objects('Survey').filtered(surveyIds.map((id) => `id == "${id}"`).join(' OR '));
      for (let i = 0; i < surveys.length; i++) {
        checkSurveyTimeTriggers(surveys[i], omitNotifications);
      }
    }
    if (callback) {
      callback();
    }
  });
}

// Saves a Form object from Parse into our Realm.io local database
export function cacheTimeTrigger(trigger, form, survey) {
  try {
    const datetime = new Date(trigger.get('properties').datetime);
    realm.write(() => {
      realm.create('TimeTrigger', {
        id: trigger.id,
        formId: form.id,
        surveyId: survey.id,
        title: form.get('title'),
        datetime: datetime,
      }, true);
    });
  } catch (e) {
    console.error(e);
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
    const newTrigger = {
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
  } catch (e) {
    console.warn(e);
  }
}

// Queries the connected Parse server for a list of Triggers.
export function loadTriggers(cachedForm, survey, callback) {
  const Form = Parse.Object.extend('Form');
  const query = new Parse.Query(Form);
  query.get(cachedForm.id,
    (form) => {
      const formTriggerRelations = form.get('triggers');
      formTriggerRelations.query().find(
        (results) => {
          for (let i = 0; i < results.length; i++) {
            if (results[i].get('type') === 'datetime') {
              cacheTimeTrigger(results[i], form, survey);
              checkSurveyTimeTriggers(survey.id, true);
            } else if (results[i].get('type') === 'geofence') {
              cacheGeofenceTrigger(results[i], form, survey);
            }
          }
          if (callback) {
            callback(null, results);
          }
        },
        (error, results) => {
          console.warn(`Error: ${error.code} ${error.message}`);
          if (callback) {
            callback(error, results);
          }
        }
      );
    }
  );
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
      return;
    }

    let triggers = [];
    let filter = '';
    let filterOptions = '';

    filterOptions += options.excludeCompleted ? ' AND completed == false' : '';
    filterOptions += options.excludeExpired ? ' AND expired == false' : '';
    filterOptions += options.includeOnlyTriggered ? ' AND triggered == true' : '';

    if (options.surveyId) {
      filter = `surveyId = "${options.surveyId}"${filterOptions}`;
      triggers = Array.from(realm.objects('TimeTrigger').filtered(filter));
    } else {
      const responseLength = response.length;
      for (let i = 0; i < responseLength; i++) {
        filter = `surveyId = "${response[i].id}"${filterOptions}`;
        const surveyTriggers = Array.from(realm.objects('TimeTrigger').filtered(filter));
        triggers = _.unionBy(triggers, surveyTriggers, 'id');
      }
    }

    callback(null, triggers);
  });
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
      return;
    }

    let filter = '';
    let filterOptions = '';
    let triggers = [];

    filterOptions += options.excludeCompleted ? ' AND completed == false' : '';
    filterOptions += options.excludeExpired ? ' AND expired == false' : '';
    filterOptions += options.includeOnlyTriggered ? ' AND triggered == true' : '';

    if (options.surveyId) {
      filter = `surveyId = "${options.surveyId}"${filterOptions}`;
      triggers = Array.from(realm.objects('GeofenceTrigger').filtered(filter));
    } else {
      const responseLength = response.length;
      for (let i = 0; i < responseLength; i++) {
        filter = `surveyId = "${response[i].id}"${filterOptions}`;
        const surveyTriggers = Array.from(realm.objects('GeofenceTrigger').filtered(filter));
        triggers = _.unionBy(triggers, surveyTriggers, 'id');
      }
    }

    callback(null, triggers);
  });
}

// Fetches the cached triggers related to a specific survey.
export function loadSurveyTriggers(options = {}, done) {
  if (!options.surveyId) {
    done('Required options parameter "surveyId" not found.');
    return;
  }

  async.auto({
    timeTriggers: (cb) => {
      loadCachedTimeTriggers(options, cb);
    },
    geofenceTriggers: (cb) => {
      loadCachedGeofenceTriggers(options, cb);
    },
  }, (err, results) => {
    if (err) {
      if (done) {
        done(err);
      }
      return;
    }
    if (done) {
      done(null, results);
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

  for (let i = geofenceTriggers.length - 1; i >= 0; i--) {
    if (geofenceTriggers[i]) {
      removeGeofenceById(geofenceTriggers[i].id);
    }
  }

  realm.write(() => {
    realm.delete(timeTriggers);
    realm.delete(geofenceTriggers);
  });
}

/**
 * Disables triggers from a target Survey, marking them as 'expired'.
 * This does not remove triggers from the cache, just adds another filter option to them.
 * @param  {string} surveyId The ID of the target survey
 */
export function disableTriggers(surveyId) {
  const timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId="${surveyId}"`);
  const geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId="${surveyId}"`);

  for (let i = geofenceTriggers.length - 1; i >= 0; i--) {
    if (geofenceTriggers[i]) {
      removeGeofenceById(geofenceTriggers[i].id);
    }
  }

  realm.write(() => {
    timeTriggers.expired = true;
    geofenceTriggers.expired = true;
  });
}
