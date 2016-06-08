// This is a realm object for testing Realm.io behavior and possible bugs.
// Not used in production.

export default class Test {}
Test.schema = {
  name: 'Test',
  primaryKey: 'id',
  properties: {
  	id: 'string',

    original: {type: 'bool', default: true},
    newString: {type: 'string', default: 'test 1'},
  }
}