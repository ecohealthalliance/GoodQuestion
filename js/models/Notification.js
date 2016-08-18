export default class Notification {}
Notification.schema = {
  name: 'Notification',
  primaryKey: 'id',
  properties: {
    id: 'string',
    userId: 'string',

    surveyId: { type: 'string', default: '' },
    formId: { type: 'string', default: '' },
    triggerId: { type: 'string', default: '' },

    title: 'string',
    message: 'string',
    createdAt: 'date',

    viewed: { type: 'bool', default: false },
    completed: { type: 'bool', default: false },
  },
};
