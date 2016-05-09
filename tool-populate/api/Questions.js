var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var DummyData = require('../data/DummyData')

function loadQuestions(options, callback) {
  var Question = Parse.Object.extend("Question")
  var query = new Parse.Query(Question)
  query.limit = 1000


  query.find({
    success: function(results) {
      storeQuestions(results)
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

function createQuestions(parentForm) {
  var questions = []
  for (var i = 0; i < DummyData.questions.length; i++) {
    var newQuestion = new Parse.Object('Question')
    
    newQuestion.set('text', DummyData.questions[i].text)
    newQuestion.set('questionType', DummyData.questions[i].questionType)
    newQuestion.set('properties', DummyData.questions[i].properties)

    newQuestion.save(null, {
      success: function(response) {
        questions.push(response)
        if (parentForm && questions.length === DummyData.questions.length) {
          var relation = parentForm.relation('questions')
          relation.add(questions)
          parentForm.save()
        }
        storeQuestions(response)
      },
      error: function(response, error) {
        console.warn('Failed to create Question, with error code: ' + error.message)
      }
    })
  }
}

function storeQuestions(newQuestions) {
  if (!Array.isArray(newQuestions)) newQuestions = [newQuestions]
  Store.questions = _.unionBy(Store.questions, newQuestions, 'id')
}

module.exports = { loadQuestions, createQuestions, storeQuestions }