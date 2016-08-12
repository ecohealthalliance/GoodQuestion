var _ = require('lodash')
var Parse = require('parse/node')
var Forms = require('./Forms')
var Survey = new Parse.Object.extend('Survey')
var Users = require('./Users')
var Helpers= require('./helpers')
var useMasterKey = {useMasterKey: true}

function loadSurveys (options, callback) {
  Helpers.fetchObjects(Survey, callback)
}

/**
  find out the amount of days between two timestamps
*/
function dayDiff (first, second) {
  return Math.floor( (second-first) / 86400000 )
}

/**
  convert "12/15/1997" to unix timestamp in ms
*/
function parseDate(str) {
    var mdy = str.split('/')
    return +new Date(mdy[2], mdy[0]-1, mdy[1])
}

function createDemoSurvey (surveyData, startDate, endDate) {
  var startDateTimestamp = parseDate(startDate)
  var endDateTimestamp = parseDate(endDate)
  var numberOfDays = dayDiff(startDateTimestamp, endDateTimestamp)
  var newSurvey = new Survey()

  var query = new Parse.Query('Survey')
  query.count(useMasterKey)
    .then(function(surveyCount){
      newSurvey.set('title', surveyData.title +' #'+ ++surveyCount)
      newSurvey.set('description', surveyData.description)
      newSurvey.set('user', surveyData.user)
      newSurvey.set('createdAt', surveyData.created)
      newSurvey.set('active', true)
      newSurvey.set('deleted', false)
      newSurvey.save(null, useMasterKey)
        .then(function(newSurvey){
          for (var i = 0; i < numberOfDays; i++) {
            Forms.createDemoForm(newSurvey, startDateTimestamp + i * 86400000)
          }
        })
        .then(function(){
          return Users.setUserRights(newSurvey)
        })
        .fail(function(error){
          console.warn('Failed to create demo Survey, error code: ' + error.message)
        })
    })
}

function destroyAll() {
  loadSurveys(null, function(err, surveys){
    if (surveys)
      Helpers.destroyObjects(surveys, 'Surveys')
  })
}

function createDemoGeofenceSurvey (surveyData) {
  var newSurvey = new Survey()
  newSurvey.set('title', surveyData.title)
  newSurvey.set('description', surveyData.description)
  newSurvey.set('user', surveyData.user)
  newSurvey.set('createdAt', surveyData.created)
  newSurvey.set('active', true)
  newSurvey.set('deleted', false)

  newSurvey.save(null, useMasterKey)
    .then(function(newSurvey){
      Forms.createDemoGeofenceForms(newSurvey)
    })
    .then(function(){
      return Users.setUserRights(newSurvey)
    })
    .fail(function(error){
      console.warn('Failed to create demo geofence Survey, error code: ' + error.message)
    })
}

module.exports = { Survey, loadSurveys, createDemoSurvey, destroyAll, createDemoGeofenceSurvey }
