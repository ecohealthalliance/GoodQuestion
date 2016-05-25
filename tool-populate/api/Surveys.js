var _ = require('lodash')
var Parse = require('parse/node')
var Forms = require('./Forms')
var Store = require('../data/Store')

// import { loadForms } from './Forms'

function loadCachedSurvey (id) {
  var Survey = Parse.Object.extend("Survey")
  var result
  for (var i = Store.surveys.length - 1; i >= 0; i--) {
    if (Store.surveys[i].id === id) result = Store.surveys[i]
  }
  return result
}

function loadSurveyList (options, callback) {
  var Survey = Parse.Object.extend("Survey")
  var query = new Parse.Query(Survey)
  query.limit = 1000

  query.find({
    success: function(results) {
      storeSurveys(results)
      Forms.loadForms()
      callback(null, results)
    },
    error: function(error, results) {
      console.warn("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}

function storeSurveys (newSurveys) {
  if (!Array.isArray(newSurveys)) newSurveys = [newSurveys]
  Store.surveys = _.unionBy(Store.surveys, newSurveys, 'id')
}

function createSurvey (surveyData) {
  var newSurvey = new Parse.Object('Survey')

  newSurvey.set('title', surveyData.title)
  newSurvey.set('user', surveyData.user)
  newSurvey.set('createdAt', surveyData.created)

  newSurvey.save(null, {
    success: function(response) {
      Forms.createForms(response)
      storeSurveys(response)
    },
    error: function(response, error) {
      console.warn('Failed to create Survey, with error code: ' + error.message)
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
  var newSurvey = new Parse.Object('Survey')
  var startDateTimestamp = parseDate(startDate)
  var endDateTimestamp = parseDate(endDate)
  var numberOfDays = dayDiff(startDateTimestamp, endDateTimestamp)

  newSurvey.set('title', surveyData.title)
  newSurvey.set('description', surveyData.description)
  newSurvey.set('user', surveyData.user)
  newSurvey.set('createdAt', surveyData.created)
  newSurvey.set('active', false)
  newSurvey.set('deleted', false)

  newSurvey.save(null, {
    success: function(response) {
      for (var i = 0; i < numberOfDays; i++) {
        Forms.createDemoForm(response, startDateTimestamp + i * 86400000)
      }
      storeSurveys(response)
    },
    error: function(response, error) {
      console.warn('Failed to create demo Survey, error code: ' + error.message)
    }
  })
}


module.exports = { loadCachedSurvey, loadSurveyList, storeSurveys, createSurvey, createDemoSurvey }
