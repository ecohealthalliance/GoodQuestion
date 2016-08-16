// Used for caching global variables that may not fit in a Realm database
const Store = {
  // App State
  appState: 'active',
  backgroundServiceState: 'deactivated',

  userSettings: {
    vibrateOnGeofence: true,
    notifyOnGeofence: true,
  },

  location: {
    lat: 0,
    long: 0,
  },

  // Globally cached objects

  // Timestamp
  lastParseUpdate: 0,
  navigator: false,
};

module.exports = Store;
