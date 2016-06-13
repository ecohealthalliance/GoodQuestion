var _ = require('lodash')
var Parse = require('parse/node')
var Forms = require('./Forms')
var Survey = new Parse.Object.extend('Survey')
var helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}

function loadSurveys (options, callback) {
  var query = new Parse.Query(Survey)
  query.limit = 1000

  query.find({
    success: function(results) {
      callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
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
  helpers.setAdminACL(newSurvey).then(function(newSurvey){
    newSurvey.set('title', surveyData.title)
    newSurvey.set('description', surveyData.description)
    newSurvey.set('user', surveyData.user)
    newSurvey.set('createdAt', surveyData.created)
    newSurvey.set('active', true)
    newSurvey.set('deleted', false)
    newSurvey.save(null, {
      useMasterKey: true,
      success: function(survey) {
        for (var i = 0; i < numberOfDays; i++) {
          Forms.createDemoForm(survey, startDateTimestamp + i * 86400000)
        }
      },
      error: function(response, error) {
        console.warn('Failed to create demo Survey, error code: ' + error.message)
      }
      storeSurveys(survey)
    },
    error: function(response, error) {
      console.warn('Failed to create demo Survey, error code: ' + error.message)
    }
  })
}

function destroyAll() {
  loadSurveys(null, function(err, surveys){
    if (surveys)
      helpers.destroyObjects(surveys, 'Surveys')
  })
}


module.exports = { Survey, loadSurveys, createDemoSurvey, destroyAll }
