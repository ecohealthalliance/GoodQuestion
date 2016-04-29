// This file will populate your local Parse Server, allowing you to run your own version of the server and create real queries for the back-end.

import Parse from 'parse/react-native'
import { loadSurveyList } from '../api/Surveys'

export function initializeParseData () {
  loadSurveyList({}, createInitialParseData)
}

function createInitialParseData (error, results) {
  if (error) {
    console.warn(error)
  } else if (results.length === 0) {
    // Create a new set of Surveys, Forms, and Questions if none of them exist.
    const Survey = Parse.Object.extend("Survey")
    createSurvey('test1', 'user1', Date.now(), [])

    console.log(Survey)
  }
}

function createSurvey(title, user, created, forms) {
  Survey = Parse.Object.extend("Survey")
  var newSurvey = new Survey()

  newSurvey.set("title", title)
  newSurvey.set("user", user)
  newSurvey.set("created", created)
  newSurvey.set("forms", forms)

  newSurvey.save(null, {
    success: function(newSurvey) {
      alert('New object created with objectId: ' + newSurvey.id)
      console.log(newSurvey)
    },
    error: function(newSurvey, error) {
      alert('Failed to create new object, with error code: ' + error.message)
    }
  })
}