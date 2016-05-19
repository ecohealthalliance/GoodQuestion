export default class Survey {}
Survey.schema = {
  name: 'Survey',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	active: 'bool',
    created: 'date',
    updated: 'date',
    
    user: 'string',
    title: 'string',
    description: 'string',
    status: {type: 'string', default: 'pending'},
  }
}