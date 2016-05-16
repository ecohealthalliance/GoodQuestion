export default class Survey {}
Survey.schema = {
  name: 'Survey',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	active: 'bool',
    created:  'date',
    updated:  'date',
    answers: 'string',
    status: 'string',
    // forms: {type: 'Form'},
  }
}