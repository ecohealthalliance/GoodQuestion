const DemoData = {

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
    }
  ],

  forms: [

  ],

  questions: [
    {
      type: 'multipleChoice',
      text: 'What is your favorite color?',
      properties: {
        choices: ['red', 'blue', 'green']
      },
      order: 1
    }, {
      type: 'checkboxes',
      text: 'What is your favorite color?',
      properties: {
        choices: ['red', 'blue', 'green']
      },
      order: 2
    }, {
      type: 'longAnswer',
      text: 'Describe any abnormalities in the location of the drag',
      properties: {
        placeholder: 'Long Text...',
        maxlength: 150
      },
      order: 3
    }, {
      type: 'shortAnswer',
      text: 'Describe any abnormalities in the location of the drag',
      properties: {
        placeholder: 'Short Text...',
        maxlength: 20
      },
      order: 4
    }, {
      type: 'date',
      text: 'When do you plan on doing a follow-up darg?',
      properties: {},
      order: 5
    }, {
      type: 'datetime',
      text: 'When do you plan on doing a follow-up darg?',
      properties: {},
      order: 6
    }, {
      type: 'number',
      text: 'How many ticks have you found in this sector of the forest?',
      properties: {
        min: 0,
        max: 999
      },
      order: 7
    }, {
      type: 'scale',
      text: 'What is the likelyhood hikers in this forest will get bitten by a tick?',
      properties: {
        min: 1,
        max: 5,
        minText: 'None at all.',
        maxText: 'Very likely.'
      },
      order: 8
    }
  ],

  triggers: [
    {
      triggerType: 'geo',
      properties: {
        lat: 40.767066,
        long: -73.978887
      }
    }
  ]

}

module.exports = DemoData
