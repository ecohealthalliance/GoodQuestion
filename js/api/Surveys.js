import _ from 'lodash';
import async from 'async';
import Parse from 'parse/react-native';
import Store from '../data/Store';
import realm from '../data/Realm';

import { loadForms, loadParseFormDataBySurveyId } from './Forms';
import { checkSurveyTimeTriggers, removeTriggers } from './Triggers';
import { loadInvitations, loadAcceptedInvitations } from '../api/Invitations';

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
    const surveysLength = surveys.length;
    for (let i = surveysLength - 1; i >= 0; i--) {
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
      const expiredSurveysLength = expiredSurveys.length;
      for (let i = 0; i < expiredSurveysLength; i++) {
        const forms = realm.objects('Form').filtered(`surveyId= "${expiredSurveys[i].surveyId}"`);
        const timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId= "${expiredSurveys[i].surveyId}"`);
        const geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId= "${expiredSurveys[i].surveyId}"`);

        const formsLength = forms.length;
        for (let j = 0; j < formsLength; j++) {
          const questions = realm.objects('Question').filtered(`formId= "${expiredSurveys[i].surveyId}"`);
          realm.delete(questions);
        }
        realm.delete(forms);
        realm.delete(timeTriggers);
        realm.delete(geofenceTriggers);
      }
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

// Attempts to find a survey with a specified id cached in the Store
export function loadCachedSurvey(id) {
  return realm.objects('Survey').filtered(`id = "${id}"`)[0];
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadCachedSurveyList() {
  return realm.objects('Survey');
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
 * Gets the Forms from a specified Survey from Parse
 * @param  {string}   surveyId ID of the target survey to fetch from
 * @param  {Function} callback Callback function which returns an array of Parse 'Form' objects
 */
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

/**
 * Refreshes all of the data of accepted surveys, including Questions and Triggers
 * @return {[type]} [description]
 */
export function refreshAcceptedSurveyData(surveyId) {
  loadAllAcceptedSurveys((err, results) => {
    if (err) {
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
    } else {
      const resultLength = results.length;
      try {
        for (let i = 0; i < resultLength; i++) {
          loadParseFormDataBySurveyId(results[i].id);
        }
      } catch (e) {
        console.warn(e);
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
export function loadSurveys(callback) {
  const Survey = Parse.Object.extend('Survey');
  const query = new Parse.Query(Survey);
  query.equalTo('active', true);
  query.find({
    success: (results) => {
      clearSurveyCache(results);
      const cachedSurveys = realm.objects('Survey');
      for (let i = 0; i < results.length; i++) {
        const cachedSurvey = cachedSurveys.filtered(`id = "${results[i].id}"`)[0];
        if (!cachedSurvey) {
          loadForms(results[i]);
        } else if (cachedSurvey.updatedAt.getTime() !== results[i].updatedAt.getTime()) {
          refreshAcceptedSurveyData(results[i].id);
        }
        cacheParseSurveys(results[i]);
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
