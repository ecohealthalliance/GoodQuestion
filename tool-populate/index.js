#! /usr/bin/env node

var Parse = require('parse/node')
var DemoData = require('./data/DemoData')
var Surveys = require('./api/Surveys')
var Forms = require('./api/Forms')
var Questions = require('./api/Questions')
var Triggers = require('./api/Triggers')
var Roles = require('./api/Roles')
var Users = require('./api/Users')
var Settings = require('./../js/settings.js')

var program = require('commander')
var colors = require('colors')

program
  .option('-i, --init', 'Create inital role and user classes.')
  .option('-c, --create', 'Create data for your local Parse server.')
  .option('-d, --demo', 'Populate local Parse server with demo data.')
  .option('-r, --reset', 'Erase local Parse data.')
  .parse(process.argv)

Parse.initialize(Settings.parse.appId, null, Settings.parse.masterKey)
Parse.serverURL = Settings.parse.serverUrl

if (program.reset) {
  resetServer()
} else if (program.init) {
  initDatabase()
} else if (program.demo) {
  createDemoData()
} else if (program.print) {
  Surveys.loadSurveys()
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
    console.log('Parse server populated.'.bold.green)
  } else if (program.demo) {
    console.log('Parse server populated with demo data.'.bold.green)
  }
  process.exit()
}

function createDemoData() {
  console.log('\nCreating Parse server data...'.bold)
  for (var i = 0, ilen = DemoData.surveys.length; i < ilen; i++)
    Surveys.createDemoSurvey(DemoData.surveys[i], DemoData.startDate, DemoData.endDate)
}

function resetServer() {
  console.log('\nReseting server...'.bold);
  Users.destroyAll()
  Surveys.destroyAll()
  Forms.destroyAll()
  Triggers.destroyAll()
  Questions.destroyAll()
}

function destroyObjects(objects) {
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].destroy({useMasterKey: true})
  }
}

function initDatabase(){
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
