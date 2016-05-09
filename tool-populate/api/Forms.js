var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var Questions = require('./Questions')
var Triggers = require('./Triggers')

function loadForms(options, callback) {
  var Form = Parse.Object.extend("Form")
  var query = new Parse.Query(Form)
  query.limit = 1000

  query.find({
    success: function(results) {
      storeForms(results)
      Triggers.loadTriggers()
      Questions.loadQuestions()
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

function createForms(parentSurvey) {
  var newForm = new Parse.Object('Form')

  newForm.save(null, {
    success: function(response) {
      if (parentSurvey) {
        var relation = parentSurvey.relation('forms')
        relation.add(newForm)
        parentSurvey.save()
      }
      Questions.createQuestions(response)
      Triggers.createTriggers(response)
      storeForms(response)
    },
    error: function(response, error) {
      console.warn('Failed to create Form, with error code: ' + error.message)
    }
  })
}

function storeForms(newForms) {
  if (!Array.isArray(newForms)) newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}

module.exports = { loadForms, createForms, storeForms }