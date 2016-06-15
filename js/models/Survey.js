import realm from '../data/Realm'

export default class Survey {
  getForms() {
    return Array.from(realm.objects('Form').filtered(`surveyId="${this.id}"`))
  }
};

Survey.schema = {
  name: 'Survey',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	active: 'bool',
    createdAt: 'date',
    updatedAt: 'date',

    user: 'string',
    title: 'string',
    description: 'string',
  }
}
