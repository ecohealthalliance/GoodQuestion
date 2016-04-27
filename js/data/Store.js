const Store = {
  platform: 'android',

  logged_in: false,
  email_verified: false,

  location: {
    lat: 0,
    long: 0,
  },

  user: {
    _id: 'SoMeH4sH',
    name: 'John Doe',
    email: 'john@doe.com',
    isAdmin: false,
  },

  surveys: [
    {
      _id: 'sur1',
      title: 'Survey #1',
      user: 'user1',
      created: Date.now() - 10000,
      forms: [ 1 ],
    },
    {
      _id: 'sur2',
      title: 'Survey #2',
      user: 'user1',
      created: Date.now() - 800000,
      forms: [ 'form1', 'form2' ],
    },
    {
      _id: 'sur2',
      title: 'Survey #3',
      user: 'user1',
      created: Date.now() - 800000,
      forms: [ 'form1', 'form2' ],
    },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    { title: 'Survey #' + Math.floor(Math.random() * 1000) },
    {
      _id: 'sur9',
      title: 'Survey #Final',
      user: 'user1',
      created: Date.now() - 800000,
      forms: [ 'form1', 'form2' ],
    },
  ],

  forms: {
    form1: {
      _id: 'form1',
      triggers: [ 't1' ],
      questions: [ 'q1', 'q2', 'q3' ]
    }
  },

  questions: {
    q1: {
      survey: 'sur1',
      text: 'What is your favorite color?',
      question_type: 'multi_choice',
      properties: {
        choices: ['red', 'blue', 'green']
      }
    },
    q2: {
      survey: 'sur1',
      text: 'What is your favorite color?',
      question_type: 'multi_choice',
      properties: {
        choices: ['red', 'blue', 'green']
      }
    },
    q3: {
      survey: 'sur1',
      text: 'What is your favorite color?',
      question_type: 'multi_choice',
      properties: {
        choices: ['red', 'blue', 'green']
      }
    },
  },

}

module.exports = Store