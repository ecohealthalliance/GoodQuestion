const Store = {
  platform: null,

  logged_in: false,
  email_verified: false,

  location: {
    lat: 0,
    long: 0,
  },

  user: {
    objectId: 'SoMeH4sH',
    name: 'John Doe',
    email: 'john@doe.com',
    isAdmin: false,
  },

  surveys: [
    {
      objectId: 's1',
      title: 'Survey #1',
      user: 'user1',
      created: Date.now() - 10000,

      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's2',
      title: 'Survey #2',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's3',
      title: 'Survey #3',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's4',
      title: 'Survey #4',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's5',
      title: 'Survey #5',
      user: 'user1',
      created: Date.now() - 10000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's6',
      title: 'Survey #6',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's7',
      title: 'Survey #7',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's8',
      title: 'Survey #8',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's9',
      title: 'Survey #9',
      user: 'user1',
      created: Date.now() - 10000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's10',
      title: 'Survey #10',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's11',
      title: 'Survey #11',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
    {
      objectId: 's12',
      title: 'Survey #12',
      user: 'user1',
      created: Date.now() - 800000,
      accepted: false,
      forms: [ 'f1', 'f2' ],
    },
  ],

  forms: [
    {
      objectId: 'f1',
      triggers: [ 't1' ],
      questions: [ 'q1', 'q2', 'q3' ]
    }
  ],

  questions: [
    {
      objectId: 'q1',
      survey: 's1',
      text: 'Tell a little about yourself',
      questionType: 'textArea',
      properties: {
        placeholder: 'Tell a little about yourself',
      },
      order: 2,
    },
    {
      objectId: 'q2',
      survey: 's1',
      text: 'What is your name?',
      questionType: 'inputText',
      properties: {
        placeholder: 'Please specify your full name',
        maxlength: 20,
        required: true,
      },
      order: 1,
    },
    {
      objectId: 'q3',
      survey: 's1',
      text: 'What is your favorite number?',
      questionType: 'multipleChoice',
      properties: {
        choices: [1, 2, 3],
        required: false,
      },
      order: 3,
    },
    {
      objectId: 'q4',
      survey: 's2',
      text: 'Tell a little about yourself',
      questionType: 'textArea',
      properties: {
        placeholder: 'Tell a little about yourself',
      },
      order: 2,
    },
    {
      objectId: 'q5',
      survey: 's2',
      text: 'What is your name?',
      questionType: 'inputText',
      properties: {
        placeholder: 'Please specify your full name',
        maxlength: 20,
        required: true,
      },
      order: 1,
    },
    {
      objectId: 'q6',
      survey: 's2',
      text: 'What is your favorite number?',
      questionType: 'multipleChoice',
      properties: {
        choices: [1, 2, 3],
        required: false,
      },
      order: 3,
    },
  ],

}

module.exports = Store
