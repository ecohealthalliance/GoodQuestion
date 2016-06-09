var _ = require('lodash')
var Parse = require('parse/node')
var Forms = require('./Forms')
var Store = require('../data/Store')
var Survey = new Parse.Object.extend('Survey')
var Helpers = require('./helpers')
var useMasterKey = {useMasterKey: true}


function loadCachedSurvey (id) {
  var result
  for (var i = Store.surveys.length - 1; i >= 0; i--) {
    if (Store.surveys[i].id === id) result = Store.surveys[i]
  }
  return result
}

function loadSurveyList (options, callback) {
  var query = new Parse.Query(Survey)
  query.limit = 1000

  query.find({
    useMasterKey: true,
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
  Helpers.setAdminACL(newSurvey).then(function(newSurvey){
    newSurvey.set('title', surveyData.title)
    newSurvey.set('description', surveyData.description)
    newSurvey.set('user', surveyData.user)
    newSurvey.set('createdAt', surveyData.created)
    newSurvey.set('active', false)
    newSurvey.set('deleted', false)
    newSurvey.save(null, {
      useMasterKey: true,
      success: function(survey) {
        for (var i = 0; i < numberOfDays; i++) {
          Forms.createDemoForm(survey, startDateTimestamp + i * 86400000)
        }
        storeSurveys(survey)
      },
      error: function(response, error) {
        console.warn('Failed to create demo Survey, error code: ' + error.message)
      }
    })
  })
}


module.exports = { Survey, loadCachedSurvey, loadSurveyList, storeSurveys, createDemoSurvey }
