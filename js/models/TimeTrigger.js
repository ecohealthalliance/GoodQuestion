export default class TimeTrigger {}
TimeTrigger.schema = {
  name: 'TimeTrigger',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	formId:  {type: 'string', default: 'none'},
  	surveyId:  {type: 'string', default: 'none'},
    
    title: 'string',
    datetime: 'date',
    triggered: {type: 'bool', default: false},
    completed: {type: 'bool', default: false},
    expired: {type: 'bool', default: false},
  }
}