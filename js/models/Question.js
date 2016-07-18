export default class Question {}
Question.schema = {
  name: 'Question',
  primaryKey: 'id',
  properties: {
    id: 'string',
    formId: 'string',
    order: 'int',
    text: 'string',
    type: 'string',
    required: 'bool',
    properties: 'string',
  },
};
