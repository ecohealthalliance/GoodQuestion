export default class Notification {}
Notification.schema = {
  name: 'Notification',
  primaryKey: 'formId',
  properties: {
    formId: 'string',
    surveyId: 'string',
    title: 'string',
    description: 'string',
    datetime: 'date',
    completed: {
      type: 'bool',
      default: false,
    },
  },
};
