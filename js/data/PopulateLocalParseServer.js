// This file will populate your local Parse Server.
// It fetches copies of the remote test server whenever yours is empty.

import Parse from 'parse/react-native'
import { loadSurveyList } from '../api/Surveys'

export function initializeParseData () {
  loadSurveyList({}, createInitialParseData)
}

function createInitialParseData (error, results) {
  if (error) {
    console.warn(error)
  } else if (results.length === 0) {
    createSurvey('test1', 'user1', Date.now(), [])

    console.log(Survey)
  }
}

function createSurvey(title, user, created, forms) {
  Survey = Parse.Object.extend("Survey")
  var newSurvey = new Survey()

  newSurvey.set("title", title)
  newSurvey.set("user", user)
  newSurvey.set("created", created)
  newSurvey.set("forms", forms)

  newSurvey.save(null, {
    success: function(newSurvey) {
      alert('New object created with objectId: ' + newSurvey.id)
      console.log(newSurvey)
    },
    error: function(newSurvey, error) {
      alert('Failed to create new object, with error code: ' + error.message)
    }
  })
}

function createForm(triggers, questions, parentSurvey) {
  Form = Parse.Object.extend("Form")
  var newForm = new Form()

  newForm.set("triggers", triggers)
  newForm.set("questions", questions)

  newForm.save(null, {
    success: function(newForm) {
      alert('New object created with objectId: ' + newForm.id)
      console.log(newForm)
    },
    error: function(newForm, error) {
      alert('Failed to create new object, with error code: ' + error.message)
    }
  })
}

function createQuestion(text, question_type, properties, parentForm) {
  Question = Parse.Object.extend("Question")
  var newQuestion = new Question()

  newQuestion.set("text", text)
  newQuestion.set("question_type", question_type)
  newQuestion.set("properties", properties)

  newQuestion.save(null, {
    success: function(newQuestion) {
      alert('New object created with objectId: ' + newQuestion.id)
      console.log(newQuestion)
    },
    error: function(newQuestion, error) {
      alert('Failed to create new object, with error code: ' + error.message)
    }
  })
}

function createTrigger(trigger_type, properties, parentForm) {
  Trigger = Parse.Object.extend("Trigger")
  var newTrigger = new Trigger()

  newTrigger.set("trigger_type", trigger_type)
  newTrigger.set("properties", properties)

  newTrigger.save(null, {
    success: function(newTrigger) {
      alert('New object created with objectId: ' + newTrigger.id)
      console.log(newTrigger)
    },
    error: function(newTrigger, error) {
      alert('Failed to create new object, with error code: ' + error.message)
    }
  })
}










