import Parse from 'parse/react-native';
import realm from '../data/Realm';
import { loadAcceptedInvitations } from '../api/Invitations';
import { addAppNotification } from '../api/Notifications';

// Saves a Form object from Parse into our Realm.io local database
function cacheTimeTrigger(trigger, form, survey) {
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
            } else {
              // TODO Create/Cache Geofence trigger
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

// Fetches the cached forms related to a specific survey
export function loadCachedTrigger(formId) {
  return realm.objects('TimeTrigger').filtered(`formId= "${formId}"`);
}

/**
 * Checks the time triggers of a single survey.
 * @param  {ibject} survey            Realm 'Survey' object to be checked
 * @param  {bool} omitNotifications   Set to true to prevent Notifications from being generated when the triggers become active
 */
export function checkSurveyTimeTriggers(survey, omitNotifications) {
  const triggers = realm.objects('TimeTrigger').filtered(`surveyId="${survey.id}" AND triggered == false`);
  const now = new Date();

  // Make the expiration date 90 days
  let past = new Date();
  past = past.setDate(past.getDate() - 90);

  // Record the new trigger
  let activeTrigger = null;
  realm.write(() => {
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].datetime < now && triggers[i].datetime > past) {
        activeTrigger = realm.create('TimeTrigger', {
          id: triggers[i].id,
          triggered: true,
        }, true);
      }
    }
  });
  if (activeTrigger && !omitNotifications) {
    addAppNotification({
      id: activeTrigger.formId,
      surveyId: activeTrigger.surveyId,
      formId: activeTrigger.formId,
      title: activeTrigger.title,
      description: 'A new scheduled survey form is available.',
      time: activeTrigger.datetime,
    });
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
    if (invitations && invitations.length > 0) {
      const surveyIds = invitations.map((invitation) => invitation.surveyId);
      const surveys = realm.objects('Survey').filtered(surveyIds.map((id) => `id == "${id}"`).join(' OR '));
      for (let i = 0; i < surveys.length; i++) {
        checkSurveyTimeTriggers(surveys[i], omitNotifications);
      }
    }
  });
}
