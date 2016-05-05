#! /usr/bin/env node
var Parse = require('parse/node')
var DummyData = require('./data/DummyData')
var Store = require('./data/Store')
var Surveys = require('./api/Surveys')
var Forms = require('./api/Forms')
var Questions = require('./api/Questions')
var Triggers = require('./api/Triggers')

var program = require('commander');
 
program
  .option('-c, --create', 'Create data for your local Parse server')
  .option('-r, --reset', 'Erase local Parse data')
  .parse(process.argv);

Parse.initialize('testapp')
Parse.serverURL = 'http://localhost:1337/parse'

if (program.reset) {
  resetLocalServer()
} else if (program.create) { 
  createData()
} else {
  program.outputHelp()
}

function createData() {
  Surveys.loadSurveyList({}, function (error, results) {
    if (error) {
      console.warn(error)
    }
    console.log('Creating initial Parse server data...')
    for (i = 0; i < DummyData.surveys.length; i++) {
      Surveys.createSurvey(DummyData.surveys[i])
    }
    setTimeout(function () {
      console.log('Stored Data: ' + 
        Store.surveys.length + ' surveys, ' +
        Store.forms.length + ' forms, ' +
        Store.questions.length + ' questions, ' +
        Store.triggers.length + ' triggers.'
      )
    }, 300)
  })
}

function resetLocalServer() {
  if (Store.server === 'local') {
    console.log('Destroying objects in local server...')
    Surveys.loadSurveyList()
    Forms.loadForms()
    Questions.loadQuestions()
    Triggers.loadTriggers()

    setTimeout(() => {
      // Destroy all our stored objects
      destroyObjects(Store.surveys)
      destroyObjects(Store.forms)
      destroyObjects(Store.questions)
      destroyObjects(Store.triggers)
      console.log('Server Reset.')
    }, 2000)
  }
}

function destroyObjects(objects) {
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].destroy()
  }
}