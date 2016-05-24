// Used for global variables that do not fit in a Realm database
const Store = {
  platform: null,
  server: 'local',

  logged_in: false,
  email_verified: false,

  location: {
    lat: 0,
    long: 0,
  },

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
