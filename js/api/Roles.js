import Parse from 'parse/react-native';

// store the value in memory
let _adminRole = null;

/**
 * returns the adminRole from the remote
 */
export function adminRole(done) {
  if (_adminRole !== null) {
    return done(null, _adminRole);
  }
  const query = new Parse.Query(Parse.Role);
  query.equalTo('name', 'admin');
  query.find(
    (roles) => {
      if (roles === null || roles.length <= 0) {
        return done(null, 'admin');
      }
      _adminRole = roles[0];
      done(null, _adminRole);
    },
    () => {
      // Parse will accept Parse.Role or the string, fallback to the string
      done(null, 'admin');
    }
  );
}
