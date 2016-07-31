export default class GeofenceTrigger {}

GeofenceTrigger.schema = {
  name: 'GeofenceTrigger',
  primaryKey: 'id',
  properties: {
    id: 'string',
    formId: 'string',
    surveyId: 'string',

    title: 'string',
    latitude: {type: 'double', default: 0},
    longitude: {type: 'double', default: 0},
    radius: {type: 'int', default: 0},

    sticky: {type: 'bool', default: false},
    triggered: {type: 'bool', default: false},
    inRange: {type: 'bool', default: false},

    completed: {type: 'bool', default: false},
  },
};
