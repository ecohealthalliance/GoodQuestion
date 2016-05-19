import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'


// Attempts to find a survey with a specified id cached in the Store
export function loadCachedSurvey(id) {
  return realm.objects('Survey').filtered(`id = "${id}"`)[0]
}

// Finds and returns the list of all surveys cached in Realm.io
export function loadCachedSurveyList() {
  return realm.objects('Survey')
}

// Queries the connected Parse server for a list of Surveys.
export function loadSurveyList(options, callback) {
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)

  query.find({
    success: function(results) {
      clearSurveyCache(results)
      cacheParseSurveys(results)
      for (var i = 0; i < results.length; i++) {
        loadForms(results[i])
      }
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

// Saves a Survey object from Parse into our Realm.io local database
export function cacheParseSurveys(surveys) {
  if (!Array.isArray(surveys)) surveys = [surveys]
  try {
    realm.write(() => {
      for (var i = 0; i < surveys.length; i++) {
        realm.create('Survey', {
          id: surveys[i].id,
          active: surveys[i].get('active') ? true : false,
          createdAt: surveys[i].get('createdAt'),
          updatedAt: surveys[i].get('updatedAt'),
          title: surveys[i].get('title'),
          description: surveys[i].get('description'),
          user: 'Test University', // get parse user name
          forms: [],
          title: surveys[i].get('title'),
        }, true)
        getSurveyOwner(surveys[i])
      }
    })
  } catch(e) {
    console.error(e)
  }
}

// Gets the name of the owner of a Survey and saves it to Realm database.
// TODO Get the organization's name
function getSurveyOwner(survey) {
  let owner = survey.get("createdBy")
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
}

// Caches Survey objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeSurveys(newSurveys) {
  if (!Array.isArray(newSurveys)) newSurveys = [newSurveys]
  Store.surveys = _.unionBy(Store.surveys, newSurveys, 'id')
}