const Store = {
  platform: 'android',

  logged_in: false,
  user: {
    name: '',
    username: '',
    last_session: '',
    email: '',
    email_verified: false,
  },
  
  surveys: [],
}

module.exports = Store