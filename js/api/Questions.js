import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'


export function loadQuestions(options, callback) {
  const Question = Parse.Object.extend("Question")
  const query = new Parse.Query(Question)

  query.find({
    success: function(results) {
      storeQuestions(results)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      alert("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}


export function storeQuestions(newQuestions) {
  if (!Array.isArray(newQuestions)) newQuestions = [newQuestions]
  Store.questions = _.unionBy(Store.questions, newQuestions, 'id')
}