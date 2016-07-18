export default class TimeTrigger {}
TimeTrigger.schema = {
  name: 'TimeTrigger',
  primaryKey: 'id',
  properties: {
    id: 'string',
    formId: {
      type: 'string',
      default: '',
    },
    surveyId: {
      type: 'string',
      default: '',
    },
    title: 'string',
    datetime: 'date',
    triggered: {
      type: 'bool',
      default: false,
    },
    completed: {
      type: 'bool',
      default: false,
    },
    expired: {
      type: 'bool',
      default: false,
    },
  },
};
