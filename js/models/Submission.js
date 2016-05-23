export default class Submission {

}
Submission.schema = {
  name: 'Submission',
  properties: {
    uniqueId: 'string',
    dirty: 'bool',
    created:  'date',
    formId: 'string',
    // Serialized JSON
    answers: 'string',
  }
}
