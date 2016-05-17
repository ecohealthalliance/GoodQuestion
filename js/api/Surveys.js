import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'

import { loadForms } from './Forms'


// Attempts to find a survey with a specified id cached in the Store
export function loadCachedSurvey(id) {
  const Survey = Parse.Object.extend("Survey")
  let result
  for (var i = Store.surveys.length - 1; i >= 0; i--) {
    if (Store.surveys[i].id === id) result = Store.surveys[i]
  }
  return result
}

// Queries the connected Parse server for a list of Surveys.
export function loadSurveyList(options, callback) {
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)

  query.find({
    success: function(results) {
      storeSurveys(results)
      for (var i = 0; i < results.length; i++) {
        cacheParseSurvey(results[i])
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
export function cacheParseSurvey(survey) {
  realm.write(() => {
    try {
      realm.create('Survey', {
        id: survey.id,
        active: survey.get('active') ? true : false,
        createdAt: survey.get('createdAt'),
        updatedAt: survey.get('updatedAt'),
        description: survey.get('description'),
        user: 'Test University', // get parse user name
        forms: [],
        title: survey.get('title'),
      }, true)
      getSurveyOwner(survey)
    } catch(e) {
      console.error(e)
    }
  })
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

// Caches Survey objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeSurveys(newSurveys) {
  if (!Array.isArray(newSurveys)) newSurveys = [newSurveys]
  Store.surveys = _.unionBy(Store.surveys, newSurveys, 'id')
}