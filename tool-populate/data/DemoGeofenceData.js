const DemoGeofenceData = {

  startDate: timestampToFormattedDate( Date.now() ),

  endDate: timestampToFormattedDate( Date.now() + 604800*1000 ), // + one week from now

  surveys: [
    {
      title: 'Demo Geofence Survey',
      description: 'Demo survey for testing maps and location stuff.',
      created: Date.now() - 10000,
    }
  ],

  forms : [
    {
      title: 'Form #1',
      order: 1, // For this demo, this matches position with the geofence object.
                // In production the order would help determine priority on overlapping geofences.
    },
    {
      title: 'Form #2',
      order: 2,
    },
    {
      title: 'Form #3',
      order: 3,
    },
    {
      title: 'Form #4',
      order: 4,
    },
  ],

  geofence: [
    {
      latitude: 40.767721,
      longitude: -73.980388,
      radius: 25,
    },
    {
      latitude: 40.767954,
      longitude: -73.982363,
      radius: 30,
    },
    {
      latitude: 40.768523,
      longitude: -73.981048,
      radius: 25,
    },
    {
      latitude: 40.769090,
      longitude: -73.979963,
      radius: 40,
    },
  ],

  questions: [
    {
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

module.exports = DemoGeofenceData