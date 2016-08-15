import _ from 'lodash';
import async from 'async';
import Parse from 'parse/react-native';
import Store from '../data/Store';
import realm from '../data/Realm';

import { loadForms, loadParseFormDataBySurveyId } from './Forms';
import { checkSurveyTimeTriggers, removeTriggers } from './Triggers';
import { loadInvitations, loadAcceptedInvitations } from '../api/Invitations';

// Live realm.io object containing all cached 'Survey' entries.
export const realmSurveys = realm.objects('Survey');

// Attempts to find a survey with a specified id cached in the Store
export function loadCachedSurvey(id) {
  return realm.objects('Survey').filtered(`id = "${id}"`)[0];
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadCachedSurveyList() {
  return realm.objects('Survey');
}

export function getSurveyForms(surveyId, callback) {
  const Survey = Parse.Object.extend('Survey');
  const query = new Parse.Query(Survey);
  query.get(surveyId,
    (survey) => {
      loadForms(survey, (err, forms) => {
        if (callback) {
          callback(null, forms);
        }
      });
    }
  );
}

// Gets the name of the owner of a Survey and saves it to Realm database.
// TODO Get the organization's name
function getSurveyOwner(survey) {
  const owner = survey.get('createdBy');
  if (!owner) {
    return;
  }
  owner.fetch((result) => {
    if (result) {
      realm.write(() => {
        try {
          realm.create('Survey', {
            id: survey.id,
            user: 'N/A',
            // user: result.get("name"),
          }, true);
        } catch (e) {
          console.error(e);
        }
      });
    }
  });
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadAllAcceptedSurveys(callback) {
  loadAcceptedInvitations((err, invitations) => {
    if (err) {
      callback(err, []);
      return;
    }

    const surveys = [];
    const invitationsLength = invitations.length;
    for (let i = 0; i < invitationsLength; i++) {
      const acceptedSurvey = realm.objects('Survey').filtered(`id = "${invitations[i].surveyId}"`)[0];
      if (acceptedSurvey) {
        surveys.push(acceptedSurvey);
      }
    }
    callback(null, surveys);
  });
}

/**
 * Refreshes all of the data of accepted surveys, including Questions and Triggers
 * @return {[type]} [description]
 */
export function refreshAcceptedSurveyData(surveyId, callback) {
  loadAllAcceptedSurveys((err, results) => {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }
    if (surveyId) {
      const surveys = _.filter(results, (survey) => {
        return survey.id === surveyId;
      });
      const survey = surveys[0];

      if (survey) {
        loadParseFormDataBySurveyId(survey.id);
      }
      if (callback) {
        callback();
      }
    } else {
      const resultLength = results.length;
      try {
        for (let i = 0; i < resultLength; i++) {
          loadParseFormDataBySurveyId(results[i].id);
        }
      } catch (e) {
        console.warn(e);
      }
      if (callback) {
        callback();
      }
    }
  });
}

// Saves a Survey object from Parse into our Realm.io local database
export function cacheParseSurveys(survey) {
  try {
    realm.write(() => {
      realm.create('Survey', {
        id: survey.id,
        active: survey.get('active'),
        createdAt: survey.get('createdAt'),
        updatedAt: survey.get('updatedAt'),
        title: survey.get('title'),
        description: survey.get('description'),
        // TODO: Get Organization's name.
        user: 'N/A',
        forms: [],
      }, true);
      getSurveyOwner(survey);
    });
  } catch (e) {
    console.error(e);
  }
}

// Queries the connected Parse server for a list of Surveys.
export function loadSurveys(options = {}, callback) {
  const Survey = Parse.Object.extend('Survey');
  const query = new Parse.Query(Survey);
  query.equalTo('deleted', false);

  // Optional: Limit Parse request to fetch active or inactive surveys only.
  if (options.active) {
    query.equalTo('active', true);
  } else if (options.expired) {
    query.equalTo('active', false);
  }

  // Optional: Query objects using an array of ids.
  if (options.surveyIds) {
    query.containedIn('objectId', options.surveyIds);
  }

  query.find({
    success: (results) => {
      if (results && results.length > 0) {
        const cachedSurveys = realm.objects('Survey');
        for (let i = 0; i < results.length; i++) {
          const cachedSurvey = cachedSurveys.filtered(`id = "${results[i].id}"`)[0];
          const cachedSurveyTriggers = realm.objects('TimeTrigger').filtered(`surveyId = "${results[i].id}"`);

          // Fetch basic form data if there is no Survey or Trigger data cached, or if the Survey data is outdated.
          if (!cachedSurvey || cachedSurvey.updatedAt.getTime() !== results[i].updatedAt.getTime()) {
            if (results[i].active) {
              loadForms(results[i]);
            }
          }
          cacheParseSurveys(results[i]);
          if (options.forceRefresh || results[i].active && !cachedSurveyTriggers || cachedSurveyTriggers.length === 0) {
            if (cachedSurvey.updatedAt.getTime() !== results[i].updatedAt.getTime()) {
              refreshAcceptedSurveyData(results[i].id);
            }
          }
        }
      }
      Store.lastParseUpdate = Date.now();
      if (callback) {
        callback(null, results);
      }
    },
    error: (error) => {
      if (callback) {
        callback(error);
      }
    },
  });
}

/**
 * Removes a list of Surveys from the Realm cache. Deletes associated Forms, Triggers, and Questions.
 * @param  {array} deletedIds Array of string ids for all of the Surveys to be removed
 */
function pruneDeletedSurveys(deletedIds) {
  let surveyFilter = 'id == ""';
  deletedIds.forEach((id) => {
    surveyFilter += ` OR id == "${id}"`;
  });
  const deletedSurveys = realmSurveys.filtered(surveyFilter);
  realm.write(() => {
    for (let i = deletedSurveys.length - 1; i >= 0; i--) {
      const forms = realm.objects('Form').filtered(`surveyId= "${deletedSurveys[i].surveyId}"`);
      const timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId= "${deletedSurveys[i].surveyId}"`);
      const geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId= "${deletedSurveys[i].surveyId}"`);

      for (let j = forms.length - 1; j >= 0; j--) {
        const questions = realm.objects('Question').filtered(`formId= "${forms[i].id}"`);
        realm.delete(questions);
      }

      realm.delete(forms);
      realm.delete(timeTriggers);
      realm.delete(geofenceTriggers);
    }

    realm.delete(deletedSurveys);
  });
}

/**
 * Finds the cached surveys missing from the latest Parse query, then checks those Surveys to identify their activity or deletion status.
 * If any active surveys are still missing from the second query, they will be pruned from the local realm database.
 * @param  {array} currentSurveys  Array of 'Survey' Parse objects
 */
function resolveMissingSurveys(currentSurveys, callback) {
  const surveyIds = [];
  let surveyFilter = 'active == true';
  currentSurveys.forEach((survey) => {
    surveyFilter += ` AND id != "${survey.id}"`;
  });
  const missingSurveys = realmSurveys.filtered(surveyFilter);
  if (missingSurveys.length === 0) {
    if (callback) {
      callback(null, []);
    }
    return;
  }

  missingSurveys.forEach((survey) => {
    surveyIds.push(survey.id);
  });

  loadSurveys({surveyIds: surveyIds}, (err, results) => {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }
    const newIds = [];
    results.forEach((survey) => {
      newIds.push(survey.id);
    });

    const missingIds = _.xor(surveyIds, newIds);
    pruneDeletedSurveys(missingIds);
    if (callback) {
      callback(null, missingIds);
    }
  });
}

/**
 * fetches remote data for surveys and invitations
 *
 * @param {object}   options, options object to be passed to loadSurveys
 * @param {function} done, the callback for when the async operations are done
 */
export function loadSurveyList(options = {}, done) {
  async.auto({
    invitations: (cb) => {
      loadInvitations(cb);
    },
    surveys: ['invitations', (cb) => {
      loadSurveys({active: true}, cb);
    }],
    missing: ['surveys', 'invitations', (cb, results) => {
      resolveMissingSurveys(results.surveys, cb);
    }],
  }, (err, results) => {
    if (err) {
      console.warn(err);
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
 * Fetches list of Invitations from remote, then acquires the expired Surveys in which the user had previously accepted.
 * @param {function} done, the callback for when the async operations are done
 */
export function loadExpiredSurveyList(done) {
  async.auto({
    invitations: (cb) => {
      loadInvitations(cb);
    },
    surveys: ['invitations', (cb, results) => {
      const acceptedInvitations = results.invitations.filter((invitation) => {
        return invitation.get('status') === 'accepted';
      });
      let surveyIds = [];
      acceptedInvitations.forEach((invitation) => {
        surveyIds.push(invitation.get('surveyId'));
      });
      surveyIds = _.uniq(surveyIds);
      loadSurveys({expired: true, surveyIds: surveyIds}, cb);
    }],
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
 * Loads the accepted Survey's data and performs a check on its triggers
 * @param  {object}   survey Realm 'Survey' object
 * @param  {Function} done   Callback function to execute when Questions and Triggers are loaded from Parse
 */
export function acceptSurvey(survey, done) {
  loadParseFormDataBySurveyId(survey.id, () => {
    checkSurveyTimeTriggers(survey, true);
    if (done) {
      done(null);
    }
  });
}

/**
 * Runs after a Survey decline.
 * Currently only clears geofence and datetime triggers cached in Realm.
 * @param  {object} survey Realm 'Survey' object.
 */
export function declineSurvey(survey) {
  removeTriggers(survey.id);
}
