// This file will populate your local Parse Server.
// It fetches copies of the remote test server whenever yours is empty.

import Parse from 'parse/react-native'
import { loadSurveyList } from '../api/Surveys'

import { storeSurveys } from '../api/Surveys'
import { storeForms } from '../api/Forms'
import { storeQuestions } from '../api/Questions'
import { storeTriggers } from '../api/Triggers'

export function initializeParseData () {
  loadSurveyList({}, createInitialParseData)
}

function createInitialParseData (error, results) {
  if (error) {
    console.warn(error)
  } else if (results.length === 0) {
    for (i = 0; i < DummyData.surveys.length; i++) {
      createSurvey(DummyData.surveys[i])
    }
  }
}

function createSurvey(surveyData) {
  const Survey = Parse.Object.extend("Survey")
  let newSurvey = new Survey()

  newSurvey.set("title", surveyData.title)
  newSurvey.set("user", surveyData.user)
  newSurvey.set("createdAt", surveyData.created)

  let forms = createForms(newSurvey)
  forms = [forms]

  newSurvey.set("forms", forms)
  storeSurveys(newSurvey)
  
  newSurvey.save()
}

function createForms(parentSurvey) {
  const Form = Parse.Object.extend("Form")
  let newForm = new Form()

  let questions = createQuestions(newForm)
  let triggers = createTriggers(newForm)

  survey.set("questions", questions)
  survey.set("triggers", triggers)

  storeForms(newForm)

  return [newForm]
}

function createQuestions(parentForm) {
  const Question = Parse.Object.extend("Question")
  let questions = []
  for (var i = 0; i < DummyData.questions.length; i++) {
    let newQuestion = new Question()
    
    newQuestion.set("text", DummyData.questions[i].text)
    newQuestion.set("question_type", DummyData.questions[i].question_type)
    newQuestion.set("properties", DummyData.questions[i].properties)

    storeQuestions(newQuestion)
    questions.push(newQuestion)
  }
  return questions
}

function createTriggers(parentForm) {
  const Trigger = Parse.Object.extend("Trigger")
  let newTrigger = new Trigger()

  newTrigger.set("trigger_type", DummyData.trigger.trigger_type)
  newTrigger.set("properties", DummyData.trigger.properties)

  storeTriggers(newTrigger)

  return [newTrigger]
}
