#! /usr/bin/env node

var Parse = require('parse/node')
var DummyData = require('./data/DummyData')
var Store = require('./data/Store')
var Surveys = require('./api/Surveys')
var Forms = require('./api/Forms')
var Questions = require('./api/Questions')
var Triggers = require('./api/Triggers')

var Settings = require('./../js/settings.js')

var program = require('commander');

program
  .option('-c, --create', 'Create data for your local Parse server.')
  .option('-r, --reset', 'Erase local Parse data.')
  .option('-p, --print', 'Prints the current data in your local server.')
  .parse(process.argv);

Parse.initialize(Settings.parse.appId)
Parse.serverURL = Settings.parse.serverUrl

if (program.reset) {
  resetLocalServer()
} else if (program.create) {
  createData()
} else if (program.print) {
  Surveys.loadSurveyList()
} else {
  program.outputHelp()
}

// Run a log before closing
process.on('exit', exitHandler.bind(null, {log:true}))
process.on('uncaughtException', exitHandler.bind(null, {exit:true}))

function exitHandler(options, err) {
    if (err)
      console.error(err.stack)

    if (program.reset) {
      console.log('Server Reset.')
    } else if (program.create) {
      console.log('Parse server populated.')
    } else if (program.print) {
      console.log('Stored Data: ' +
        Store.surveys.length + ' surveys, ' +
        Store.forms.length + ' forms, ' +
        Store.questions.length + ' questions, ' +
        Store.triggers.length + ' triggers.'
      )
    }

    process.exit()
}




function createData() {
  Surveys.loadSurveyList({}, function (error, results) {
    if (error) {
      console.warn(error)
    }
    console.log('Creating Parse server data...')
    for (i = 0; i < DummyData.surveys.length; i++) {
      Surveys.createSurvey(DummyData.surveys[i])
    }
  })
}

function resetLocalServer() {
  if (Store.server === 'local') {
    console.log('Destroying objects in local server...')
    Surveys.loadSurveyList()
    Forms.loadForms()
    Triggers.loadTriggers()
    Questions.loadQuestions({}, function () {
      destroyObjects(Store.surveys)
      destroyObjects(Store.forms)
      destroyObjects(Store.questions)
      destroyObjects(Store.triggers)
    })
  }
}

function destroyObjects(objects) {
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].destroy()
  }
}
