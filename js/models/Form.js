export default class Form {}
Form.schema = {
  name: 'Form',
  primaryKey: 'id',
  properties: {
    id: 'string',
    surveyId: 'string',
    order: 'int',
    title: 'string',
  },
};
