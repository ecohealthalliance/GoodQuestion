import async from 'async';
import Parse from 'parse/react-native';
import Store from '../data/Store';
import realm from '../data/Realm';

import { loadForms } from './Forms';
import { InvitationStatus, loadInvitations, loadCachedInvitation } from '../api/Invitations';

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

// Erases the current cache of Surveys
function clearSurveyCache(exclusions) {
  try {
    const surveys = realm.objects('Survey');
    const expiredSurveys = [];
    const excludedIds = [];
    for (let i = 0; i < exclusions.length; i++) {
      excludedIds.push(exclusions[i].id);
    }

    // Standard JS array.filter doesn't work with these Realm objects, so we have to take care of this filtering manually.
    // Current version of Realm.io does not support exclusion queries for strings.
    for (let i = surveys.length - 1; i >= 0; i--) {
      let expired = true;
      for (let j = excludedIds.length - 1; j >= 0; j--) {
        if (surveys[i].id === excludedIds[j]) {
          expired = false;
        }
      }
      if (expired) {
        expiredSurveys.push(surveys[i]);
      }
    }

    realm.write(() => {
      realm.delete(expiredSurveys);
    });
  } catch (e) {
    console.error(e);
  }
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
        expired: survey.get('deleted'),
      }, true);
      getSurveyOwner(survey);
    });
  } catch (e) {
    console.error(e);
  }
}

// Queries the connected Parse server for a list of Surveys.
export function loadSurveys(callback) {
  const Survey = Parse.Object.extend('Survey');
  const query = new Parse.Query(Survey);
  query.equalTo('active', true);
  query.find(
    (results) => {
      if (results && results.length > 0) {
        clearSurveyCache(results);
        const cachedSurveys = realm.objects('Survey');
        for (let i = 0; i < results.length; i++) {
          const cachedSurvey = cachedSurveys.filtered(`id = "${results[i].id}"`)[0];
          const cachedSurveyTriggers = realm.objects('TimeTrigger').filtered(`surveyId = "${results[i].id}"`);
          if (!cachedSurvey || !cachedSurveyTriggers || cachedSurveyTriggers.length === 0 || cachedSurvey.updatedAt.getTime() !== results[i].updatedAt.getTime()) {
            cacheParseSurveys(results[i]);
            loadForms(results[i]);
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
 * fetches remote data for surveys and invitations
 *
 * @param {function} done, the callback for when the async operations are done
 */
export function loadSurveyList(done) {
  async.auto({
    surveys: (cb) => {
      loadSurveys(cb);
    },
    invitations: (cb) => {
      loadInvitations(cb);
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
