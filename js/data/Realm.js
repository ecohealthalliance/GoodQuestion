import Realm from 'realm';

// Models
import Submission from '../models/Submission'
import Survey from '../models/Survey'
import Form from '../models/Form'
import Question from '../models/Question'

const realmInstance = new Realm({
  schema: [
    Survey,
    Form,
    Question,
    Submission,
  ],
  schemaVersion: 11,
})

export default realmInstance;