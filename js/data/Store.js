// Used for caching global variables that may not fit in a Realm database
const Store = {
  // Timestamp
  lastParseUpdate: 0,
  navigator: false,
};

module.exports = Store;
