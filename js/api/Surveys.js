import { InteractionManager } from 'react-native'
import _ from 'lodash'
import async from 'async'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms, loadParseFormDataBySurveyId } from './Forms'
import { checkSurveyTimeTriggers, removeTriggers } from './Triggers'
import { InvitationStatus, loadInvitations, loadCachedInvitation, loadAcceptedInvitations } from '../api/Invitations'
import { setupGeofences } from './Geofencing'

// Attempts to find a survey with a specified id cached in the Store
export function loadCachedSurvey(id) {
  return realm.objects('Survey').filtered(`id = "${id}"`)[0]
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadCachedSurveyList() {
  return realm.objects('Survey')
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadAllAcceptedSurveys(callback) {
  loadAcceptedInvitations((err, invitations) => {
    if (err) {
      callback(err, [])
      return
    }

    let surveys = []
    const invitationsLength = invitations.length;
    for (var i = 0; i < invitationsLength; i++) {
      let acceptedSurvey = realm.objects('Survey').filtered(`id = "${invitations[i].surveyId}"`)[0]
      if (acceptedSurvey) {
        surveys.push(acceptedSurvey)
      }
    }
    callback(null, surveys)
  })
}

/**
 * Gets the Forms from a specified Survey from Parse
 * @param  {string}   surveyId ID of the target survey to fetch from
 * @param  {Function} callback Callback function which returns an array of Parse 'Form' objects
 */
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

export function acceptSurvey(survey, done) {
  loadParseFormDataBySurveyId(survey.id, ()=>{
    checkSurveyTimeTriggers(survey, true);
    if (done) done(null);
  })
}

export function declineSurvey(survey) {
  removeTriggers(survey.id);
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
    const surveysLength = surveys.length;
    for (var i = surveysLength - 1; i >= 0; i--) {
      let expired = true
      for (var j = excludedIds.length - 1; j >= 0; j--) {
        if (surveys[i].id === excludedIds[j]) expired = false
      }
      if (expired) expiredSurveys.push(surveys[i])
    }

    realm.write(() => {
      const expiredSurveysLength = expiredSurveys.length;
      for (var i = 0; i < expiredSurveysLength; i++) {
        let forms = realm.objects('Form').filtered(`surveyId= "${expiredSurveys[i].surveyId}"`)
        let timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId= "${expiredSurveys[i].surveyId}"`)
        let geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId= "${expiredSurveys[i].surveyId}"`)

        let formsLength = forms.length;
        for (var j = 0; j < formsLength; j++) {
          let questions = realm.objects('Question').filtered(`formId= "${expiredSurveys[i].surveyId}"`)
          realm.delete(questions)
        }
        realm.delete(forms)
        realm.delete(timeTriggers)
        realm.delete(geofenceTriggers)
      }
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

        // Check for active geofence triggers.
        let geofenceTriggers = realm.objects('GeofenceTrigger').filtered(`surveyId="${surveyId}"`)
        if (geofenceTriggers && geofenceTriggers.length > 0) {
          let geofenceTriggersInRange = geofenceTriggers.filtered(`triggered == true AND completed == false AND inRange == true OR sticky == true`)
          result.geofenceTriggersInRange = geofenceTriggersInRange.length
        }
      } catch (e) {
        console.warn(e)
      }
    }
    return done(null, result)
  });
}
