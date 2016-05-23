export default class TimeTrigger {}
TimeTrigger.schema = {
  name: 'TimeTrigger',
  primaryKey: 'formId',
  properties: {
  	formId: 'string',
    
    title: 'string',
    datetime: 'date',
    triggered: {type: 'bool', default: false},
  }
}