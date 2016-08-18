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

  // Global component refs
  navigator: false,

  // Shared variables
  initialRouteStack: [
    { path: 'surveylist', title: 'Surveys' },
  ],
  newNotifications: 0,
  lastParseUpdate: 0,
};

module.exports = Store;
