// This file will populate your local Parse Server, allowing you to run your own version of the server and create real queries for the back-end.

import Parse from 'parse/react-native'

const PopulateParseServer = () => {
  const Surveys = Parse.Object.extend("Surveys")

  createSurvey('test1', 'user1', Date.now(), [])

  console.log(Surveys)
}

function createSurvey(title, user, created, forms) {
  Survey = Parse.Object.extend("Survey")
  var newSurvey = new Survey()

  newSurvey.set("title", title)
  newSurvey.set("user", "Sean Plott")
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

module.exports = PopulateParseServer