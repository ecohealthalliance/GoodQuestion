var _               = require('lodash')
var Parse           = require('parse/node')
var DemoData        = require('../data/DemoData')
var Users           = require('./Users')
var Helpers         = require('./Helpers')
var Forms           = require('./Forms')
var Questions       = require('./Questions')
var Chance          = require('chance')
var crypto          = require('crypto-js')

var chance          = new Chance()
var Submission      = Parse.Object.extend("Submission")
var useMasterKey    = {useMasterKey: true}

/**
 * user may only have one submission for each formId
 *
 * @param {string} formId, the unique id for the parse form record
 * @param {object} user, the current parse user saved to AsyncStorage
 */
function genSubmissionId(formId, user, done) {
  const str = `${user.id}${formId}`;
  const id = crypto.MD5(str).toString();
  done(null, id);
}

function loadSubmissions(options, callback) {
  Helpers.fetchObjects(Submission, callback)
}

function randomNum(min, max){
  return chance.integer({min:min,max:max})
}

function createAnswer(question) {
  var question = question.toJSON()
  var props = question.properties
  var choices = props.choices
  var answer = null
  switch(question.type) {
    case 'multipleChoice':
      answer = choices[randomNum(0, choices.length - 1)]
      break
    case 'checkboxes':
      var numberChosen = randomNum(0, choices.length),
          _choices = _.shuffle(choices)
      answer = []
      for(var i = 0; i < numberChosen; i++){
        answer.push(_choices[i])
      }
      break
    case 'longAnswer':
      answer = chance.paragraph({sentences: randomNum(5, 10)})
      break
    case 'shortAnswer':
      answer = chance.sentence({words: randomNum(1, 15)})
      break
    case 'date':
      // Randomly add repetitive dates
      random = randomNum(0,2)
      if (random === 1) answer = new Date('02-14-2016')
      else answer = chance.date()
      break
    case 'datetime':
      answer = chance.date()
      break
    case 'number':
    case 'scale':
      answer = randomNum(props.min, props.max)
      break
  }
  return answer
}

function createSubmission(answers, form, user) {
  submission = new Submission()
  genSubmissionId(form.id, user, function(err, id){
    submission.set('answers', answers)
    submission.set('formId', form.id)
    submission.set('userId', user)
    submission.set('uniqueId', id)
    submission.save(null, useMasterKey)
  })
}

function createSubmissions() {
  Users.loadUsers()
    .then(function(users){
      Forms.loadForms(null, function(err, forms){
        users.forEach(function(user){
          forms.forEach(function(form){
            Questions.loadFormQuestions(form)
              .then(function(questions){
                var answers = {}
                questions.forEach(function(question){
                  answers[question.id] = createAnswer(question)
                })
                createSubmission(answers, form, user)
              })
          })
        })
      })
    })
}

function destroyAll() {
  loadSubmissions(null, function(err, submissions){
    if (submissions)
      Helpers.destroyObjects(submissions, 'Submissions')
  })
}

module.exports = { Submission, loadSubmissions, createSubmissions, destroyAll }
