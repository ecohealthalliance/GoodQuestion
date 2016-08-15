#! /usr/bin/env node

var _ = require('lodash')
var Parse = require('parse/node')
var program = require('commander')
var colors = require('colors')
var DemoData = require('./data/DemoData')
var DemoGeofenceData = require('./data/DemoGeofenceData')
var Surveys = require('./api/Surveys')
var Forms = require('./api/Forms')
var Questions = require('./api/Questions')
var Triggers = require('./api/Triggers')
var Roles = require('./api/Roles')
var Users = require('./api/Users')
var Submissions = require('./api/Submissions')
var Settings = require('./../js/settings.js')

var useMasterKey = {useMasterKey: true}

program
  .option('-i, --init', 'Create inital role and user classes.')
  .option('-d, --demo', 'Populate local Parse server with demo data.')
  .option('-g, --demoGeofence', 'Populate local Parse server with geofence demo data.')
  .option('-r, --reset', 'Erase local Parse data.')
  .option('-p, --publicRead', 'Sets all surveys, forms, questions as public readable')
  .option('-s, --submissions', 'Creates dummy submissions for each dummy user')
  .option('-c, --clearSubmissions', 'Clears submissions')
  .parse(process.argv)

Parse.initialize(Settings.parse.appId, null, Settings.parse.masterKey)
Parse.serverURL = Settings.parse.serverUrl

if (program.reset) {
  resetServer()
} else if (program.init) {
  initDatabase()
} else if (program.demo) {
  checkUsers().then(createDemoData)
} else if (program.demoGeofence) {
  checkUsers().then(createDemoGeofenceData)
} else if (program.print) {
  Surveys.loadSurveys()
} else if (program.publicRead) {
  publicRead()
} else if (program.submissions) {
  createSubmissions()
} else if (program.clearSubmissions) {
  clearSubmissions()
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
  } else if (program.demoGeofence) {
    console.log('Parse server populated with demo geofence data.'.bold.green)
  }
  process.exit()
}

function createDemoData() {
  console.log('\nCreating Parse server data...'.bold)
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
  console.log('\nReseting server...'.bold);
  Users.destroyAll()
  Surveys.destroyAll()
  Forms.destroyAll()
  Triggers.destroyAll()
  Questions.destroyAll()
  Submissions.destroyAll()
}

function destroyObjects(objects) {
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].destroy({useMasterKey: true})
  }
}

function initDatabase(){
  initRoles().then(createUsers).then(Roles.setRoleACLs)
}

function createUsers(){
  return new Promise(function(resolve){
    Users.createInitialAdmin()
      .then(function(){
        return Users.createUsers()
      })
      .then(function(){
        console.log('Initial users created'.green);
        resolve()
      })
  })
}

function checkUsers(){
  return new Promise(function(resolve){
    var query = new Parse.Query(Parse.User)
    query.first(useMasterKey)
      .then(function(user){
        if (_.isUndefined(user)) createUsers().then(resolve)
        else resolve()
      })
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

/**
 * update all surveys, forms, triggers, questions in the database to
 * public read
 */
function publicRead() {
  console.log('NOTE: This only works up to 1000 objects'.bold);
  Surveys.loadSurveys(null, function(err, results) {
    console.log('Setting publicReadAccess(true) to ' + results.length + ' surveys'.green);
    if (results) {
      results.forEach(function(obj) {
        var acl = obj.getACL();
        acl.setPublicReadAccess(true);
        obj.setACL(acl);
        obj.save(null, useMasterKey);
      });
    }
  });
  Forms.loadForms(null, function(err, results) {
    console.log('Setting publicReadAccess(true) to ' + results.length + ' forms'.green);
    if (results) {
      results.forEach(function(obj) {
        var acl = obj.getACL();
        acl.setPublicReadAccess(true);
        obj.setACL(acl);
        obj.save(null, useMasterKey);
      });
    }
  });
  Triggers.loadTriggers(null, function(err, results) {
    console.log('Setting publicReadAccess(true) to ' + results.length + ' triggers'.green);
    if (results) {
      results.forEach(function(obj) {
        var acl = obj.getACL();
        acl.setPublicReadAccess(true);
        obj.setACL(acl);
        obj.save(null, useMasterKey);
      });
    }
  });
  Questions.loadQuestions(null, function(err, results) {
    console.log('Setting publicReadAccess(true) to ' + results.length + ' questions'.green);
    if (results) {
      results.forEach(function(obj) {
        var acl = obj.getACL();
        acl.setPublicReadAccess(true);
        obj.setACL(acl);
        obj.save(null, useMasterKey);
      });
    }
  });
}

function createSubmissions(){
  console.log('Creating submissions...'.bold)
  Submissions.createSubmissions()
}

function clearSubmissions(){
  console.log('\nClearing submissions...'.bold)
  Submissions.destroyAll()
}
