import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'


// Saves a Question object from Parse into our Realm.io local database
export function cacheParseQuestion(question, formId) {
  realm.write(() => {
    try {
      realm.create('Question', {
        id: question.id,
        formId: formId,
        order: question.get('order'),
        text: question.get('text'),
        type: question.get('type'),
        properties: JSON.stringify(question.get('properties')),
      }, true)
    } catch (e) {
      console.error(e)
    }
  })
}

// Queries the connected Parse server for a list of Questions.
export function loadQuestions(form, callback) {
  const formQuestionRelations = form.get('questions')
  formQuestionRelations.query().find({
    success: function(results) {
      storeQuestions(results)
      for (var i = 0; i < results.length; i++) {
        cacheParseQuestion(results[i], form.id)
      }
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
