var _ = require('lodash')
var Parse = require('parse/node')
var Questions = require('./Questions')
var Triggers = require('./Triggers')
var Form = Parse.Object.extend("Form")
var Helpers = require('./Helpers')
var useMasterKey = {useMasterKey: true}
var Users = require('./Users')

function loadForms (options, callback) {
  Helpers.fetchObjects(Form, callback)
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
  newForm.set('title', 'Form ' + Date.now())
  newForm.set('order', 1)
  newForm.set('deleted', false)
  newForm.save(null, useMasterKey)
    .then(function(newForm){
      return parentSurvey.fetch(useMasterKey)
    })
    .then(function(survey){
      var relation = survey.relation('forms')
      relation.add(newForm)
      survey.save(null, useMasterKey)
    })
    .then(function(){
      return Users.setUserRights(newForm)
    })
    .then(function(){
      Questions.createDemoQuestions(newForm)
      Triggers.createDemoTrigger(newForm, randomHour(dayStartTimestamp))
    })
    .fail(function(e){console.log(e);})
}

function destroyAll() {
  loadForms(null, function(err, forms){
    if (forms)
      Helpers.destroyObjects(forms, 'Forms')
  })
}

module.exports = { Form, loadForms, createDemoForm, destroyAll }
