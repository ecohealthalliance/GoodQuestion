import { InteractionManager } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'


// Saves a Question object from Parse into our Realm.io local database
export function cacheParseQuestions(questions, formId) {
  try {
    // InteractionManager.runAfterInteractions(() => {
      realm.write(() => {
        for (var i = 0; i < questions.length; i++) {
          realm.create('Question', {
            id: questions[i].id,
            formId: formId,
            order: questions[i].get('order'),
            text: questions[i].get('text'),
            type: questions[i].get('type'),
            required: questions[i].get('required') ? true : false,
            properties: JSON.stringify(questions[i].get('properties')),
          }, true)
        }
      })
    // })
  } catch (e) {
    console.error(e)
  }
}

// Loads a question list from the Realm.io database
export function loadCachedQuestions(formId) {
  return realm.objects('Question')
          .filtered(`formId = "${formId}"`)
          .sorted('order')
}

// Queries the connected Parse server for a list of Questions.
export function loadQuestions(form, callback) {
  const Form = Parse.Object.extend("Form")
  const query = new Parse.Query(Form)
  query.get(form.id, {
    success: function(form) {
      const formQuestionRelations = form.get('questions')
      formQuestionRelations.query().find({
        success: function(results) {
          cacheParseQuestions(results, form.id)
          if (callback) callback(null, results)
        },
        error: function(error, results) {
          console.warn("Error: " + error.code + " " + error.message)
          if (callback) callback(error, results)
        }
      })
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}
