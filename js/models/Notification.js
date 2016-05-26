export default class Notification {}
Notification.schema = {
  name: 'Notification',
  primaryKey: 'formId',
  properties: {
  	formId: 'string',
    
    title: 'string',
    description: 'string',
    datetime: 'date',
    complete: {type: 'bool', default: false},
  }
}