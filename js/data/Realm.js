import Realm from 'realm';

// Models
import Submission from '../models/Submission'
import Survey from '../models/Survey'


const realm = new Realm({schema: [
  Submission,
  Survey,
]})

export default realm;