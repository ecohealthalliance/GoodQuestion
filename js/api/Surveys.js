import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

import { loadSurveys } from '../api/Surveys'


export function loadCachedSurvey(id) {
  const Survey = Parse.Object.extend("Survey")

  let result
  for (var i = Store.surveys.length - 1; i >= 0; i--) {
    if (Store.surveys[i].id === id) result = Store.surveys[i]
  }
  return result
}

export function loadSurveyList(options, callback) {
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)

  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " surveys.")
      storeSurveys(results)

      loadForms()

      if (callback) callback(null, results)
    },
    error: function(error, results) {
      alert("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })

  setTimeout(function(){console.log(Store)}, 500)
}

export function storeSurveys(newSurveys) {
  if (!Array.isArray(newSurveys)) newSurveys = [newSurveys]
  Store.surveys = _.unionBy(Store.surveys, newSurveys, 'id')
}
