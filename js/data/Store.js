// Used for caching global variables that may not fit in a Realm database
const Store = {
  // Cache control
  lastParseUpdate: 0,

  // Global component refs
  navigator: false,

  // Shared variables
  initialRouteStack: [
    { path: 'surveylist', title: 'Surveys' },
  ],
  newNotifications: 0,
};

module.exports = Store;
