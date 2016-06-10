var _ = require('lodash')
var Parse = require('parse/node')
var Store = require('../data/Store')
var Questions = require('./Questions')
var Triggers = require('./Triggers')
var DemoGeofenceData = require('../data/DemoGeofenceData')
var Form = Parse.Object.extend("Form")


function loadForms(options, callback) {
  form = new Form()
  var query = new Parse.Query(form)
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

function storeForms(newForms) {
  if (!Array.isArray(newForms))
    newForms = [newForms]
  Store.forms = _.unionBy(Store.forms, newForms, 'id')
}

function createForms(parentSurvey) {
  var newForm = new Form()
  var relation = parentSurvey.relation('forms')
  relation.add(newForm)
  newForm.save(null, {
    success: function(response) {
      parentSurvey.save(null, {useMasterKey: true})
      Questions.createQuestions(response)
      Triggers.createTriggers(response)
      storeForms(response)
    },
    error: function(response, error) {
      console.warn('Failed to create Form, with error code: ' + error.message)
    }
  })
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
  newForm.set('title', 'Form ' + Date.now())
  newForm.set('order', 1)
  newForm.set('deleted', false)
  newForm.save(null, {
    useMasterKey: true,
    success: function(form) {
      parentSurvey.fetch().then(function(survey){
        var relation = survey.relation('forms')
        relation.add(form)
        survey.save(null, {useMasterKey: true})
      })
      Questions.createDemoQuestions(form)
      Triggers.createDemoTrigger(form, randomHour(dayStartTimestamp))
      storeForms(form)
    },
    error: function(form, error) {
      console.warn('Failed to create Form, with error code: ' + error.message)
    }
  })
}

function createDemoGeofenceForms(parentSurvey) {
  console.log('geo form')
  var data = DemoGeofenceData.forms
  for (var i = 0; i < data.length; i++) {
    
    var newForm = new Form()
    newForm.set('title', data[i].title)
    newForm.set('order', data[i].order)
    newForm.set('deleted', false)
    newForm.save(null, {
      useMasterKey: true,
      success: function(form) {
        parentSurvey.fetch().then(function(survey){
          var relation = survey.relation('forms')
          relation.add(form)
          survey.save(null, {useMasterKey: true})
        })
        Questions.createDemoGeofenceQuestions(form)
        Triggers.createDemoGeofenceTrigger(form)
        storeForms(form)
      },
      error: function(form, error) {
        console.warn('Failed to create Form, with error code: ' + error.message)
      }
    })
  }
  
}

module.exports = { Form, loadForms, createForms, storeForms, createDemoForm, createDemoGeofenceForms }
