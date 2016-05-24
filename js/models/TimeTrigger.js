export default class TimeTrigger {}
TimeTrigger.schema = {
  name: 'TimeTrigger',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	formId: 'string',
  	surveyId: 'string',
    
    title: 'string',
    datetime: 'date',
    triggered: {type: 'bool', default: false},
  }
}