Settings = require('../../js/settings')

const DemoData = {

  startDate: timestampToFormattedDate( Date.now() ),

  endDate: timestampToFormattedDate( Date.now() + 604800*1000 ), // + one week from now
  users:{
    admins: {
      user: Settings.users[0].user,
      pass: Settings.users[0].pass
    },
    regularUsers: [
      {
        userName: 'a@a.com',
        pass: 'password'
      }, {
        userName: 'b@b.com',
        pass: 'password'
      }, {
        userName: 'c@c.com',
        pass: 'password'
      }, {
        userName: 'd@d.com',
        pass: 'password'
      }
    ]
  },
  surveys: [
    {
      title: 'Demo Survey #1',
      description: 'Demo survey for testing various things',
      created: Date.now() - 10000,
    }
  ],

  questions: [
    {
      type: 'multipleChoice',
      text: 'What is your favorite color? (multi)',
      properties: {
        choices: ['red', 'blue', 'green']
      }
    }, {
      type: 'checkboxes',
      text: 'What is your favorite color? (cb)',
      properties: {
        choices: ['red', 'blue', 'green']
      }
    }, {
      type: 'longAnswer',
      text: 'Describe any abnormalities in the location of the drag (long)',
      properties: {
        placeholder: 'Long Text...',
        maxlength: 150
      }
    }, {
      type: 'shortAnswer',
      text: 'Describe any abnormalities in the location of the drag (short)',
      properties: {
        placeholder: 'Short Text...',
        maxlength: 20
      }
    }, {
      type: 'date',
      text: 'When do you plan on doing a follow-up darg? (date)',
      properties: {}
    }, {
      type: 'datetime',
      text: 'When do you plan on doing a follow-up darg? (datetime)',
      properties: {}
    }, {
      type: 'number',
      text: 'How many ticks have you found in this sector of the forest?',
      properties: {
        min: 0,
        max: 999
      }
    }, {
      type: 'scale',
      text: 'What is the likelyhood hikers in this forest will get bitten by a tick?',
      properties: {
        min: 1,
        max: 5,
        minText: 'None at all.',
        maxText: 'Very likely.'
      }
    }
  ]

}

function timestampToFormattedDate (timestamp) {
  var date = new Date(timestamp)
  var dd = date.getDate()
  var mm = date.getMonth()+1 // Jan is 0

  var yyyy = date.getFullYear()
  if (dd < 10) {
      dd='0'+dd
  }
  if (mm < 10) {
      mm = '0' + mm
  }
  return mm + '/' + dd + '/' + yyyy
}

module.exports = DemoData
