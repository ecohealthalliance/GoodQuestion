var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var DummyData = require('../data/DummyData')
var DemoData = require('../data/DemoData')
var Question = Parse.Object.extend("Question")
var Helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}

function loadQuestions(options, callback) {
  var query = new Parse.Query(Question)
  query.limit = 1000

  query.find({
    useMasterKey: true,
    success: function(results) {
      storeQuestions(results)
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

function storeQuestions(newQuestions) {
  if (!Array.isArray(newQuestions)) newQuestions = [newQuestions]
  Store.questions = _.unionBy(Store.questions, newQuestions, 'id')
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
    Helpers.setAdminACL(newQuestion).then(function(newQuestion) {
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
      })
    })
  }
}

module.exports = { Question, loadQuestions, storeQuestions, createDemoQuestions }
