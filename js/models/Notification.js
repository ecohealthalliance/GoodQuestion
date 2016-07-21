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
    viewed: {
      type: 'bool',
      default: false,
    },
    complete: {
      type: 'bool',
      default: false,
    },
  },
};
