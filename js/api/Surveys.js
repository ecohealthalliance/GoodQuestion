import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

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
      loadForms()
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
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
