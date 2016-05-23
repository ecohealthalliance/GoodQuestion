export default class Notification {}
Notification.schema = {
  name: 'Notification',
  primaryKey: 'formId',
  properties: {
  	formId: 'string',
    
    title: 'string',
    description: 'string',
    complete: 'bool',
  }
}