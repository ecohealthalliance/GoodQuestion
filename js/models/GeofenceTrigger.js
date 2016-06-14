export default class GeofenceTrigger {}
GeofenceTrigger.schema = {
  name: 'GeofenceTrigger',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	formId: 'string',
  	surveyId: 'string',
    
    title: 'string',
    latitude: 'double',
    longitude: 'double',
    radius: 'double',

    triggered: {type: 'bool', default: false},
    inRange: {type: 'bool', default: false},
  }
}