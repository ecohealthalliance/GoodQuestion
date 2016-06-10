#! /usr/bin/env node

var Parse = require('parse/node')
var DummyData = require('./data/DummyData')
var Store = require('./data/Store')
var DemoData = require('./data/DemoData')
var DemoGeofenceData = require('./data/DemoGeofenceData')
var Surveys = require('./api/Surveys')
var Forms = require('./api/Forms')
var Questions = require('./api/Questions')
var Triggers = require('./api/Triggers')
var Roles = require('./api/Roles')

var Settings = require('./../js/settings.js')

var program = require('commander')

program
  .option('-i, --init', 'Create inital role and user classes.')
  .option('-c, --create', 'Create data for your local Parse server.')
  .option('-d, --demo', 'Populate local Parse server with demo data.')
  .option('-g, --demoGeofence', 'Populate local Parse server with geofence demo data.')
  .option('-r, --reset', 'Erase local Parse data.')
  .option('-p, --print', 'Prints the current data in your local server.')
  .parse(process.argv)

Parse.initialize(Settings.parse.appId, null, Settings.parse.masterKey)
Parse.serverURL = Settings.parse.serverUrl

if (program.reset) {
  resetServer()
} else if (program.create) {
  createData()
} else if (program.init) {
  initRoles()
} else if (program.demo) {
  createDemoData()
}  else if (program.demoGeofence) {
  createDemoGeofenceData()
} else if (program.print) {
  Surveys.loadSurveyList()
} else {
  program.outputHelp()
}

// Run a log before closing
process.on('exit', exitHandler.bind(null, {log: true}))
process.on('uncaughtException', exitHandler.bind(null, {exit: true}))

function exitHandler(options, err) {
  if (err)
    console.error(err.stack)

  if (program.reset) {
    console.log('Server Reset.')
  } else if (program.create) {
    console.log('Parse server populated.')
  } else if (program.demo) {
    console.log('Parse server populated with demo data.')
  } else if (program.demoGeofence) {
    console.log('Parse server populated with demo data.')
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
    console.log('Creating Parse server demo data...')
    for (var i = 0, ilen = DummyData.surveys.length; i < ilen; i++) {
      Surveys.createSurvey(DummyData.surveys[i])
    }
  })
}

function createDemoData() {
  // create the demo Survey
  console.log('Creating Parse server data...')
  for (var i = 0, ilen = DemoData.surveys.length; i < ilen; i++)
    Surveys.createDemoSurvey(DemoData.surveys[i], DemoData.startDate, DemoData.endDate)
}

function createDemoGeofenceData() {
  // create the demo Survey for geofence triggers
  console.log('Creating Parse server data...')
  for (var i = 0; i < DemoGeofenceData.surveys.length; i++) {
    Surveys.createDemoGeofenceSurvey(DemoGeofenceData.surveys[i])
  }    
}

function resetServer() {
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

function destroyObjects(objects) {
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].destroy({useMasterKey: true})
  }
}

function initRoles() {
  var rolesToCreate = ["admin", "user"];

  Roles.loadRoles({}, function (error, results) {
    console.log(results)
    for (var i = 0, ilen = rolesToCreate.length; i < ilen; i++) {
      (function(roleToCreate){
        var queryRole = new Parse.Query(Parse.Role);
        queryRole.equalTo('name', roleToCreate);
        queryRole.first({
          success: function (result) { // Role Object
            console.log(result)
            if (result) {
              console.log('Role "' + roleToCreate + '" already exists');
            } else {
              Roles.createRole(roleToCreate);
            }
          },
          error: function(error) {}
        });
      })(rolesToCreate[i])
    }
  });
}
