import { InteractionManager } from 'react-native'
import _ from 'lodash'
import async from 'async'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'
import { InvitationStatus, loadInvitations, loadCachedInvitation } from '../api/Invitations'

// Attempts to find a survey with a specified id cached in the Store
export function loadCachedSurvey(id) {
  return realm.objects('Survey').filtered(`id = "${id}"`)[0]
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadCachedSurveyList() {
  return realm.objects('Survey')
}

export function getSurveyForms(surveyId, callback){
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)
  query.get(surveyId, {
    success: function(survey) {
      loadForms(survey, function(err, forms){
        if (callback) callback(null, forms)
      })
    }
  })
}

// Queries the connected Parse server for a list of Surveys.
export function loadSurveys(callback) {
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)
  query.equalTo("active", true)
  query.find({
    success: function(results) {
      clearSurveyCache(results)
      let cachedSurveys = realm.objects('Survey')
      for (var i = 0; i < results.length; i++) {
        let cachedSurvey = cachedSurveys.filtered(`id = "${results[i].id}"`)[0];
        let cachedSurveyTriggers = realm.objects('TimeTrigger').filtered(`surveyId = "${results[i].id}"`);
        if( !cachedSurvey ||
            !cachedSurveyTriggers ||
            cachedSurveyTriggers.length == 0 ||
            cachedSurvey.updatedAt.getTime() != results[i].updatedAt.getTime()
          ) {
          cacheParseSurveys(results[i]);
          loadForms(results[i]);
        }
      }
      Store.lastParseUpdate = Date.now();
      if (callback) callback(null, results);
    },
    error: function(error) {
      if (callback) callback(error);
    }
  })
};

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
      if (done) done(err);
      return;
    }
    if (done) done(null, true)
  });
}


// Saves a Survey object from Parse into our Realm.io local database
export function cacheParseSurveys(survey) {
  try {
    realm.write(() => {
      realm.create('Survey', {
        id: survey.id,
        active: survey.get('active') ? true : false,
        createdAt: survey.get('createdAt'),
        updatedAt: survey.get('updatedAt'),
        title: survey.get('title'),
        description: survey.get('description'),
        user: 'Test University', // get parse user name
        forms: [],
        title: survey.get('title'),
      }, true)
      getSurveyOwner(survey)
    })
  } catch(e) {
    console.error(e)
  }
}

// Gets the name of the owner of a Survey and saves it to Realm database.
// TODO Get the organization's name
function getSurveyOwner(survey) {
  let owner = survey.get("createdBy")
  if (!owner) return;
  owner.fetch({
    success: function(owner) {
      realm.write(() => {
        try {
          realm.create('Survey', {
            id: survey.id,
            user: 'Organization\'s Name',
            // user: owner.get("name"),
          }, true)
        } catch(e) {
          console.error(e)
        }
      })
    }
  })
}

// Erases the current cache of Surveys
function clearSurveyCache(exclusions) {
  try {
    let surveys = realm.objects('Survey')
    let expiredSurveys = []
    let excludedIds = []
    for (var i = 0; i < exclusions.length; i++) {
      excludedIds.push(exclusions[i].id)
    }

    // Standard JS array.filter doesn't work with these Realm objects, so we have to take care of this filtering manually.
    // Current version of Realm.io does not support exclusion queries for strings.
    for (var i = surveys.length - 1; i >= 0; i--) {
      let expired = true
      for (var j = excludedIds.length - 1; j >= 0; j--) {
        if (surveys[i].id === excludedIds[j]) expired = false
      }
      if (expired) expiredSurveys.push(surveys[i])
    }

    realm.write(() => {
      realm.delete(expiredSurveys)
    })
  } catch (e) {
    console.error(e)
  }
};

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
        let timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId="${surveyId}"`)
        let availableTimeTriggers = timeTriggers.filtered(`triggered == true AND completed == false`)
        if (availableTimeTriggers && availableTimeTriggers.length > 0) {
          result.availableTimeTriggers = availableTimeTriggers.length
        }

        // Check for the next future time trigger.
        let nextTimeTriggers = timeTriggers.filtered(`triggered == false`).sorted('datetime')
        if (nextTimeTriggers && nextTimeTriggers.length > 0) {
          result.nextTimeTrigger = nextTimeTriggers[0].datetime
        }
        // TODO: Geofence trigger availability.
        // Blocked by geofencing not being implemented yet.
      } catch (e) {
        console.warn(e)
      }
    }
    return done(null, result)
  });
}
