var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var Questions = require('./Questions')
var Triggers = require('./Triggers')
var Form = Parse.Object.extend("Form")
var Helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}


function loadForms(options, callback) {
  var form = new Form()
  var query = new Parse.Query(form)
  query.limit = 1000

  query.find({
    useMasterKey: true,
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

function storeForms(newForms) {
  if (!Array.isArray(newForms))
    newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}

/**
  generate random time between 5am and 9pm for a given day
*/
function randomHour(dayTimestamp) {
  var startHour = 5, endHour = 21;
  var date = new Date(dayTimestamp)
  var hour = startHour + Math.random() * (endHour - startHour) | 0;

  date.setHours(hour);

  return date;
}

function createDemoForm(parentSurvey, dayStartTimestamp) {
  var newForm = new Form()
  var acl = new Parse.ACL()
  Helpers.setAdminACL(newForm).then(function(newForm) {
    newForm.set('title', 'Form ' + Date.now())
    newForm.set('order', 1)
    newForm.set('deleted', false)
    newForm.save(null, {
      useMasterKey: true,
      success: function(form) {
        parentSurvey.fetch(useMasterKey).then(function(survey){
          var relation = survey.relation('forms')
          relation.add(form)
          survey.save(null, useMasterKey)
        }).fail(function(e){console.log(e);})
        Questions.createDemoQuestions(form)
        Triggers.createDemoTrigger(form, randomHour(dayStartTimestamp))
        storeForms(form)
      },
      error: function(form, error) {
        console.warn('Failed to create Form, with error code: ' + error.message)
      }
    })
  })
}

module.exports = { Form, loadForms, storeForms, createDemoForm }
