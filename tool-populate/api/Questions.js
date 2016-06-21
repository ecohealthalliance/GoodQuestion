var _ = require('lodash')
var Parse = require('parse/node')
var DemoData = require('../data/DemoData')
var DemoGeofenceData = require('../data/DemoGeofenceData')
var Users = require('./Users')
var Helpers = require('./Helpers')
var Question = Parse.Object.extend("Question")
var useMasterKey = {useMasterKey: true}

function loadQuestions (options, callback) {
  Helpers.fetchObjects(Question, callback)
}

function createDemoQuestions(parentForm) {
  var questions = []
  var limit = DemoData.questions.length < 10 ? DemoData.questions.length : 10
  var questionOrder = []
  for (var i = 0; i < DemoData.questions.length; i++)
    questionOrder.push(i)
  questionOrder = _.shuffle(questionOrder)

  for (var i = 0; i < limit; i++) {
    var newQuestion = new Question()

    var randomQuestionIndex = questionOrder[i]

    newQuestion.set('text', DemoData.questions[randomQuestionIndex].text)
    newQuestion.set('type', DemoData.questions[randomQuestionIndex].type)
    newQuestion.set('properties', DemoData.questions[randomQuestionIndex].properties)
    newQuestion.set('order', i + 1)

    newQuestion.save(null, useMasterKey)
      .then(function(newQuestion){
        return new Promise(function(resolve){
          questions.push(newQuestion)
          if (parentForm && questions.length === limit) {
            var relation = parentForm.relation('questions')
            relation.add(questions)
            parentForm.save(null, useMasterKey).then(function(){
              resolve(newQuestion)
            })
          } else resolve(newQuestion)
        })
      })
      .then(function(question){
        return Users.setUserRights(question)
      })
      .fail(function(response, error) {
        console.warn('Failed to create Question, with error code: ' + error.message)
      })
  }
}

function createDemoGeofenceQuestions(parentForm) {
  var data = DemoGeofenceData.questions
  var questions = []
  var limit = data.length < 10 ? data.length : 10

  for (var i = 0; i < data.length; i++) {
    var newQuestion = new Question()
    
    newQuestion.set('text', data[i].text)
    newQuestion.set('type', data[i].type)
    newQuestion.set('properties', data[i].properties)
    newQuestion.set('order', i + 1)

    newQuestion.save(null, {
      useMasterKey: true,
      success: function(response) {
        questions.push(response)
        if (parentForm && questions.length === limit) {
          var relation = parentForm.relation('questions')
          relation.add(questions)
          parentForm.save(null, {useMasterKey: true})
        }
      },
      error: function(response, error) {
        console.warn('Failed to create Question, with error code: ' + error.message)
      }
    })
  }
}

function destroyAll() {
  loadQuestions(null, function(err, questions){
    if (questions)
      Helpers.destroyObjects(questions, 'Questions')
  })
}

module.exports = { Question, loadQuestions, createDemoQuestions, destroyAll, createDemoGeofenceQuestions }
