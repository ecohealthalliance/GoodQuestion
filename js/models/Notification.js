export default class Notification {}
Notification.schema = {
  name: 'Notification',
  primaryKey: 'id',
  properties: {
    id: 'string',
    formId: 'string',
    userId: 'string',
    surveyId: 'string',
    title: 'string',
    description: 'string',
    datetime: 'date',
    viewed: {
      type: 'bool',
      default: false,
    },
    completed: {
      type: 'bool',
      default: false,
    },
  },
};
