import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'

// Queries the connected Parse server for a list of Triggers.
export function loadQuestions(form, callback) {
  const formQuestionRelations = form.get('questions')
  formQuestionRelations.query().find({
    success: function(questions) {
      storeQuestions(questions)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

// Caches Question objects inside the Store.
// May take an array of objects or a single object.
// Objects are unique and indentified by id, with the newest entries always replacing the oldest.
export function storeQuestions(newQuestions) {
  if (!Array.isArray(newQuestions)) newQuestions = [newQuestions]
  Store.questions = _.unionBy(Store.questions, newQuestions, 'id')
}