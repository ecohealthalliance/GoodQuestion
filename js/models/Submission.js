export default class Submission {}
Submission.schema = {
  name: 'Submission',
  primaryKey: 'uniqueId',
  properties: {
    uniqueId: 'string',
    dirty: 'bool',
    created: 'date',
    formId: 'string',
    userId: 'string',
    inProgress: 'bool',
    // Serialized JSON
    answers: 'string',
  },
};
