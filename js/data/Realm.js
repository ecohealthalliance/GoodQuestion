import Realm from 'realm';

// Models
import Submission from '../models/Submission'
import Survey from '../models/Survey'
import Form from '../models/Form'
import Question from '../models/Question'
import Notification from '../models/Notification'

const realmInstance = new Realm({
  schema: [
    Survey,
    Form,
    Question,
    Notification,
    Submission,
  ],
  schemaVersion: 12,
})

export default realmInstance;