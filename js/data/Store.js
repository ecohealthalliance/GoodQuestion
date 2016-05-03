const Store = {
  platform: 'android',
  server: 'local',

  logged_in: false,
  email_verified: false,

  location: {
    lat: 0,
    long: 0,
  },

  user: {},
  surveys: [],
  forms: [],
  questions: [],
  triggers: [],
}

module.exports = Store
