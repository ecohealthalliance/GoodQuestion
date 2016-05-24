import Realm from 'realm';

// Models
import Submission from '../models/Submission'
import Survey from '../models/Survey'
import Form from '../models/Form'
import Question from '../models/Question'
import Notification from '../models/Notification'
import TimeTrigger from '../models/TimeTrigger'

const realmInstance = new Realm({
  schema: [
    Survey,
    Form,
    Question,
    Notification,
    TimeTrigger,
    Submission,
  ],
  schemaVersion: 24,
})

export default realmInstance;
