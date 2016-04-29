import Parse from 'react/native'



export function loadSurvey(id) {
  Survey = Parse.Object.extend("Survey")
  
  console.log(Survey)
}


export function loadSurveyList() {
  Survey = Parse.Object.extend("Survey")
}
