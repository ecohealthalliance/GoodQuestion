import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'


export function loadSurvey(id) {
  const Survey = Parse.Object.extend("Survey")

  console.log(Survey)
  return Survey
}


export function loadSurveyList(options, callback) {
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)

  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " scores.")
      storeSurveyList(results)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      alert("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

export function storeSurveyList(list) {
  Store.surveys = _.unionBy(Store.surveys, list, 'id')
}


