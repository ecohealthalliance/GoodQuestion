export default class GeofenceTrigger {}
GeofenceTrigger.schema = {
  name: 'GeofenceTrigger',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	formId: 'string',
  	surveyId: 'string',
    
    title: 'string',
    latitude: 'number',
    longitude: 'number',
    radius: 'number',
    triggered: {type: 'bool', default: false},
  }
}