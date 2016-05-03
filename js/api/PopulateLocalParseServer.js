// This file will populate your local Parse Server.
// It fetches copies of the remote test server whenever yours is empty.

import Parse from 'parse/react-native'
import Store from '../data/Store'
import DummyData from '../data/DummyData'

import { loadSurveyList, storeSurveys } from '../api/Surveys'
import { loadForms, storeForms } from '../api/Forms'
import { loadQuestions, storeQuestions } from '../api/Questions'
import { loadTriggers, storeTriggers } from '../api/Triggers'

export function initializeParseData () {
  if ( Store.server === 'local' ) {
    loadSurveyList({}, createInitialParseData)
  } else {
    loadSurveyList({})
  }
}

function createInitialParseData (error, results) {
  if (error) {
    console.warn(error)
  } else if (results.length === 0) {
    console.log('Creating initial Parse server data...')
    for (i = 0; i < DummyData.surveys.length; i++) {
      createSurvey(DummyData.surveys[i])
    }
  }
}

function createSurvey(surveyData) {
  const Survey = Parse.Object.extend('Survey')
  let newSurvey = new Survey()

  newSurvey.set('title', surveyData.title)
  newSurvey.set('user', surveyData.user)
  newSurvey.set('createdAt', surveyData.created)

  newSurvey.save(null, {
    success: function(response) {
      console.log('New Survey created with objectId: ' + response.id)
      createForms(response)
      storeSurveys(response)
    },
    error: function(response, error) {
      console.warn('Failed to create Survey, with error code: ' + error.message)
    }
  })
}

function createForms(parentSurvey) {
  const Form = Parse.Object.extend('Form')
  let newForm = new Form()

  newForm.set('survey', parentSurvey)
  
  newForm.save(null, {
    success: function(response) {
      console.log('New Form created with objectId: ' + response.id)
      createQuestions(response)
      createTriggers(response)
      storeForms(response)
    },
    error: function(response, error) {
      console.warn('Failed to create Form, with error code: ' + error.message)
    }
  })
}

function createQuestions(parentForm) {
  const Question = Parse.Object.extend('Question')
  for (var i = 0; i < DummyData.questions.length; i++) {
    let newQuestion = new Question()
    
    newQuestion.set('text', DummyData.questions[i].text)
    newQuestion.set('question_type', DummyData.questions[i].question_type)
    newQuestion.set('properties', DummyData.questions[i].properties)
    newQuestion.set('form', parentForm)

    newQuestion.save(null, {
    success: function(response) {
        console.log('New Question created with objectId: ' + response.id)
        storeQuestions(response)
      },
      error: function(response, error) {
        console.warn('Failed to create Question, with error code: ' + error.message)
      }
    })
  }
}

function createTriggers(parentForm) {
  const Trigger = Parse.Object.extend('Trigger')
  let newTrigger = new Trigger()

  newTrigger.set('trigger_type', DummyData.trigger.trigger_type)
  newTrigger.set('properties', DummyData.trigger.properties)
  newTrigger.set('form', parentForm)

  newTrigger.save(null, {
    success: function(response) {
        console.log('New Trigger created with objectId: ' + response.id)
        storeTriggers(response)
      },
      error: function(response, error) {
        console.warn('Failed to create Trigger, with error code: ' + error.message)
      }
    })
}

export function resetLocalServer() {
  if (Store.server === 'local') {
    console.log('Destroying objects in local server...')
    loadSurveyList()
    loadForms()
    loadQuestions()
    loadTriggers()

    setTimeout(() => {
      // Destroy all our stored objects
      destroyObjects(Store.surveys)
      destroyObjects(Store.forms)
      destroyObjects(Store.questions)
      destroyObjects(Store.triggers)
      console.log('Server Reset.')
    }, 1000)
  }
}

function destroyObjects(objects) {
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].destroy()
  }
}