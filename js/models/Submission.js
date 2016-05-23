export default class Submission {}
Submission.schema = {
  name: 'Submission',
  properties: {
    created:  'date',
    formId: 'string',
    // Serialized JSON
    answers: 'string',
  }
}