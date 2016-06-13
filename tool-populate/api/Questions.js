var _ = require('lodash')
var Parse = require('parse/node')
var DemoData = require('../data/DemoData')
var Question = Parse.Object.extend("Question")
var helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}

function loadQuestions(options, callback) {
  var query = new Parse.Query(Question)
  query.limit = 1000

  query.find({
    success: function(results) {
      if (callback)
        callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback)
        callback(error, results)
    }
  })
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
    helpers.setAdminACL(newQuestion).then(function(newQuestion) {
      newQuestion.save(null, {
        useMasterKey: true,
        success: function(question) {
          questions.push(question)
          if (parentForm && questions.length === limit) {
            var relation = parentForm.relation('questions')
            relation.add(questions)
            parentForm.save(null, useMasterKey)
          }
          storeQuestions(question)
        },
        error: function(response, error) {
          console.warn('Failed to create Question, with error code: ' + error.message)
        }
        storeQuestions(response)
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
      helpers.destroyObjects(questions, 'Questions')
  })
}

module.exports = { Question, loadQuestions, createDemoQuestions, destroyAll }
