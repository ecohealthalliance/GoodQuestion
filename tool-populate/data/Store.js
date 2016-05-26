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

  surveys: [],
  forms: [],
  questions: [],
  triggers: [],
}

module.exports = Store
