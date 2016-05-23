export default class TimeTrigger {}
TimeTrigger.schema = {
  name: 'TimeTrigger',
  primaryKey: 'formId',
  properties: {
  	formId: 'string',
    
    timestamp: 'int',
    triggered: 'bool',
  }
}