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

  surveys: [],

  forms: [{
    "name": "Test form",
    "triggers": [],
    "questions": ["Zu4NSjytykfje3dH4", "wqzz4TBDvRYNrKXic", "RHxZwpGCxAjX5vFkQ"],
    "order": 1
  }],

  questions: [{
    survey: 'sur1',
    text: 'What is your favorite color?',
    question_type: 'multi_choice',
    properties: {
      choices: ['red', 'blue', 'green']
    }
  }, {
    "question_type": "inputText",
    "text": "What is your name?",
    "value": "John Doe",
    "properties": {
      "placeholder": "Please Specify Your Full Name",
      "maxlength": 20,
      "required": true
    },
    "order": 1
  }, {
    "question_type": "textArea",
    "text": "Short bio",
    "properties": { "placeholder": "Tell a little about yourself", "maxlength": 20 },
    "order": 2
  }, {
    "question_type": "inputText",
    "text": "How did you find us?",
    "properties": { "placeholder": "Web search/newspaper/a friend", "maxlength": 20 },
    "order": 3
  }, ],

}

module.exports = Store
