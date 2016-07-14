export default class Invitation {}
Invitation.schema = {
  name: 'Invitation',
  primaryKey: 'uniqueId',
  properties: {
    uniqueId: 'string',
    dirty: 'bool',
    surveyId: 'string',
    userId: 'string',
    status: {
      type: 'string',
      default: 'pending',
    },
  },
};
