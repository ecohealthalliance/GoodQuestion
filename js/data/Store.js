// Used for caching global variables that may not fit in a Realm database
const Store = {
  // Settings
  platform: null,
  server: 'local',

  // App State
  appState: 'active',
  backgroundServiceState: 'started',

  userSettings: {
    vibrateOnGeofence: true,
    notifyOnGeofence: true,
  },

  logged_in: false,
  email_verified: false,

  lastParseUpdate: 0, // Timestamp

  location: {
    lat: 0,
    long: 0,
  },

  // Globally cached objects
  navigator: false,


  user: {
    objectId: 'SoMeH4sH',
    name: 'John Doe',
    email: 'john@doe.com',
    isAdmin: false,
  },
  surveys: [],
  forms: [],
  questions: [],
  triggers: [],
}

module.exports = Store
