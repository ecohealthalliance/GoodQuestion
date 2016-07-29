import _ from 'lodash';
import async from 'async';
import Parse from 'parse/react-native';
import Store from '../data/Store';
import realm from '../data/Realm';

import { loadForms } from './Forms';
import { InvitationStatus, loadInvitations, loadCachedInvitation } from '../api/Invitations';

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
  owner.fetch(
    () => {
      realm.write(() => {
        try {
          realm.create('Survey', {
            id: survey.id,
            user: 'Organization\'s Name',
          }, true);
        } catch (e) {
          console.error(e);
        }
      });
    }
  );
}

// Saves a Survey object from Parse into our Realm.io local database
export function cacheParseSurveys(survey) {
  try {
    realm.write(() => {
      realm.create('Survey', {
        id: survey.id,
        active: survey.get('active') || false,
        createdAt: survey.get('createdAt'),
        updatedAt: survey.get('updatedAt'),
        title: survey.get('title'),
        description: survey.get('description'),
        user: 'Test University',
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

  query.find(
    (results) => {
      if (results && results.length > 0) {
        const cachedSurveys = realm.objects('Survey');
        for (let i = 0; i < results.length; i++) {
          const cachedSurvey = cachedSurveys.filtered(`id = "${results[i].id}"`)[0];
          const cachedSurveyTriggers = realm.objects('TimeTrigger').filtered(`surveyId = "${results[i].id}"`);
          if (!cachedSurvey || !cachedSurveyTriggers || cachedSurveyTriggers.length === 0 || cachedSurvey.updatedAt.getTime() !== results[i].updatedAt.getTime()) {
            cacheParseSurveys(results[i]);
            if (results[i].active) {
              loadForms(results[i]);
            }
          }
        }
        Store.lastParseUpdate = Date.now();
        if (callback) {
          callback(null, results);
        }
        return;
      }
      callback(null, []);
    },
    () => {
      if (callback) {
        callback('Network Error');
      }
    }
  );
}

/**
 * Removes a list of Surveys from the Realm cache.
 * @param  {array} deletedIds Array of string ids for all of the Surveys to be removed
 */
function pruneDeletedSurveys(deletedIds) {
  let surveyFilter = 'id == ""';
  deletedIds.forEach((id) => {
    surveyFilter += ` OR id == "${id}"`;
  });
  const deletedSurveys = realmSurveys.filtered(surveyFilter);
  realm.write(() => {
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

  loadSurveys({surveyIds: surveyIds}, (results) => {
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
 * @param {function} done, the callback for when the async operations are done
 */
export function loadSurveyList(done) {
  async.auto({
    surveys: (cb) => {
      loadSurveys({active: true}, cb);
    },
    invitations: (cb) => {
      loadInvitations(cb);
    },
    missing: ['surveys', 'invitations', (cb, results) => {
      resolveMissingSurveys(results.surveys, cb);
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
 * determines if the surveyId has an accepted invitation for the current user.
 *
 * @param {string} surveyId, the survey id from the cache
 */
export function getFormAvailability(surveyId, done) {
  const result = {
    availableTimeTriggers: 0,
    nextTimeTrigger: false,
    geofenceTriggersInRange: 0,
  };
  loadCachedInvitation(surveyId, (err, invitation) => {
    if (err) {
      console.warn(err);
      done(null, result);
      return;
    }
    if (invitation && invitation.status === InvitationStatus.ACCEPTED) {
      try {
        // Check for availability on pending time triggers.
        const timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId="${surveyId}"`);
        const availableTimeTriggers = timeTriggers.filtered('triggered == true AND completed == false');
        if (availableTimeTriggers && availableTimeTriggers.length > 0) {
          result.availableTimeTriggers = availableTimeTriggers.length;
        }

        // Check for the next future time trigger.
        const nextTimeTriggers = timeTriggers.filtered('triggered == false').sorted('datetime');
        if (nextTimeTriggers && nextTimeTriggers.length > 0) {
          result.nextTimeTrigger = nextTimeTriggers[0].datetime;
        }
        // TODO: Geofence trigger availability.
        // Blocked by geofencing not being implemented yet.
      } catch (e) {
        console.warn(e);
      }
    }
    return done(null, result);
  });
}
