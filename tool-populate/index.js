#! /usr/bin/env node

var Parse = require('parse/node')
var DummyData = require('./data/DummyData')
var Store = require('./data/Store')
var DemoData = require('./data/DemoData')
var Surveys = require('./api/Surveys')
var Forms = require('./api/Forms')
var Questions = require('./api/Questions')
var Triggers = require('./api/Triggers')
var Roles = require('./api/Roles')
var Users = require('./api/Users')
var helpers = require('./api/helpers')
var Settings = require('./../js/settings.js')

var program = require('commander')
var colors = require('colors')

program
  .option('-i, --init', 'Create inital role and user classes.')
  .option('-c, --create', 'Create data for your local Parse server.')
  .option('-d, --demo', 'Populate local Parse server with demo data.')
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
  initDB()
} else if (program.demo) {
  createDemoData()
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
    console.log('\nServer Reset.'.bold.green)
  } else if (program.create) {
    console.log('\nParse server populated.'.bold.green)
  } else if (program.demo) {
    console.log('\nParse server populated with demo data.'.bold.green)
  } else if (program.print) {
    console.log('\nStored Data: ' +
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
    console.log('Creating Parse server demo data...'.bold)
    for (var i = 0, ilen = DummyData.surveys.length; i < ilen; i++) {
      Surveys.createSurvey(DummyData.surveys[i])
    }
  })
}

function createDemoData() {
  // create the demo Survey
  console.log('Creating Parse server data...'.bold)
  for (var i = 0, ilen = DemoData.surveys.length; i < ilen; i++)
    Surveys.createDemoSurvey(DemoData.surveys[i], DemoData.startDate, DemoData.endDate)
}

function resetServer() {
  Surveys.loadSurveyList()
  Forms.loadForms()
  Triggers.loadTriggers()
  Users.destroyAll()
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

function initDB(){
  initRoles().then(createUsers)
}

function createUsers(){
  Users.createInitialAdmin()
    .then(function(){
      return Users.createUsers()
    })
    .then(function(){
      console.log('Initial users created'.green);
    })
}

function initRoles() {
  console.log('\nCreating admin and user roles...'.bold);
  var rolesToCreate = ["admin", "user"];
  return new Promise(function(resolve){
    rolesToCreate.forEach(function(roleToCreate, i, roles){
      Roles.getRole(roleToCreate)
        .then(function(role){
          if (role) {
            console.log(colors.yellow('Role "' + roleToCreate + '" already exists'))
            if (i === roles.length-1) resolve()
          }
          else
            Roles.createRole(roleToCreate).then(function(){
              if (i === roles.length-1) resolve()
            })
        })
        .fail(function(error) {console.log(error)})
    })
  })
}
