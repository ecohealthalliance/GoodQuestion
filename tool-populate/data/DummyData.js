const DummyData = {

  surveys: [
    {
      title: 'Survey #1',
      user: 'user1',
      created: Date.now() - 10000,
    }, 
    {
      title: 'Survey #2',
      user: 'user1',
      created: Date.now() - 50000,
    }, 
    {
      title: 'Survey #3',
      user: 'user1',
      created: Date.now() - 100000,
    },
  ],

  trigger: {
    triggerType: 'geo',
    properties: {
      lat: 40.767066,
      long: -73.978887,
    }
  },

  questions: [
    {
      questionType: 'multipleChoice',
      text: 'What is your favorite color?',
      properties: {
        choices: ['red', 'blue', 'green']
      },
      order: 1,
    }, {
      questionType: 'checkboxes',
      text: 'What is your favorite color?',
      properties: {
        choices: ['red', 'blue', 'green']
      },
      order: 1,
    }, {
      questionType: 'longAnswer',
      text: 'Describe any abnormalities in the location of the drag',
      properties: { 
        placeholder: 'Long Text...',
        maxlength: 150,
      },
      order: 2,
    }, {
      questionType: 'shortAnswer',
      text: 'Describe any abnormalities in the location of the drag',
      properties: {
        placeholder: 'Short Text...',
        maxlength: 20,
      },
      order: 3,
    }, {
      questionType: 'date',
      text: 'When do you plan on doing a follow-up darg?',
      properties: {},
      order: 4,
    }, {
      questionType: 'datetime',
      text: 'When do you plan on doing a follow-up darg?',
      properties: {},
      order: 5,
    }, {
      questionType: 'number',
      text: 'How many ticks have you found in this sector of the forest?',
      properties: {
        min: 0,
        max: 999,
      },
      order: 6,
    }, {
      questionType: 'scale',
      text: 'What is the likelyhood hikers in this forest will get bitten by a tick?',
      properties: {
        min: 1,
        max: 5,
        minText: 'None at all.',
        maxText: 'Very likely.',
      },
      order: 7,
    },
  ],

}

module.exports = DummyData
