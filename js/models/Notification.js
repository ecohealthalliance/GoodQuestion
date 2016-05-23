export default class Notification {}
Notification.schema = {
  name: 'Notification',
  primaryKey: 'id',
  properties: {
    id: 'string',
  	formId: 'string',
    
    title: 'string',
    description: 'string',
    complete: 'bool',
  }
}