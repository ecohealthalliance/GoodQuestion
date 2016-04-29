import Parse from 'parse/react-native'


export function loadSurvey(id) {
  const Survey = Parse.Object.extend("Survey")

  console.log(Survey)
}


export function loadSurveyList(options, callback) {
  const Survey = Parse.Object.extend("Survey")
  const query = new Parse.Query(Survey)

  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " scores.")
      if (callback) callback(null, results)
    },
    error: function(error, results) {
      alert("Error: " + error.code + " " + error.message)
      if (callback) callback(error, results)
    }
  })
}
