import Parse from 'parse/react-native'
import Store from '../data/Store'

import async from 'async'

import Settings from '../settings'

/**
 * authenticates against openam then parse
 *
 * @param {string} username
 * @param {string} password
 * @param {function} the function to execute when done
 */
export function authenticate(username, password, done) {
  async.auto({
    /**
     * authenticates against openam
     *
     * @param {function} the callback when done with this async operation
     */
    openam: function(cb) {
      if (Settings.dev) return cb(null, true);
      let authConfig = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-OpenAM-Username': username,
          'X-OpenAM-Password': password,
        }
      };
      let url = Settings.openam.baseUrl+Settings.openam.authPath;
      fetch(url, authConfig).then(function(res) {
        if (!res.ok) {
          cb('Unauthorized');
          return;
        }
        cb(null, res);
      }).catch(function() {
        cb('Unauthorized');
      });
    },
    /**
     * authenticates against parse
     *
     * @param {function} the callback when done with this async operation
     */
    parse: ['openam', function(cb) {
      Parse.User.logIn(username, password).then(
        function(user) {
          cb(null, user);
        },
        function(user) {
          cb('Unauthorized');
        }
      );
    }]
  }, function(err, results) {
    if (err) {
      done(err);
      return;
    }
    done(null, results.parse);
  });
};

/**
 * is the current parse user authenticated
 *
 * @param {function} the function to execute when done, will be a single value
 * true/false
 *
 */
export function isAuthenticated(done) {
  currentUser(function(err, user) {
    if (err) {
      done(false);
    } else {
      done(true);
    }
  });
};

/**
 * get the current user
 *
 * @param {function} the function to execute when done, will be in the format
 *  err, res
 */
export function currentUser(done) {
  Parse.User.currentAsync().then(
    function(user) {
      if (user && typeof user.getSessionToken() !== 'undefined') {
        done(null, user);
      } else {
        done('Invalid User');
      }
    },
    function(err) {
      done('Invalid User');
    }
  );
};

/**
 *
 * OpenAm admin authentication to get session of authorized user who is capable
 * of creating user accounts.
 *
 * @param {function} done, the function to execute when done
 */
function openamAuth(done) {
  const openAmEmail = Settings.openam.email;
  const openAmPassword = Settings.openam.password;
  let authConfig = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-OpenAM-Username': openAmEmail,
      'X-OpenAM-Password': openAmPassword,
    }
  };
  let url = Settings.openam.baseUrl+Settings.openam.authPath;
  fetch(url, authConfig).then(function(res) {
    return res.text();
  }).then(function(responseText) {
    const jsonData = JSON.parse(responseText);
    if (!jsonData.hasOwnProperty('tokenId')) {
      done('Invalid tokenId');
      return;
    }
    done(null, jsonData.tokenId);
  }).catch(function() {
    done('Unauthorized');
  });
};

/**
 *
 * OpenAm register a user with a valid tokenId
 *
 * @param {object} user, the user object to create an openam profile
 * @param {string} tokenId, the admin tokenId to sign the request
 * @param {function} done, the function to execute when done
 */
function openamRegister(user, tokenId, done) {
  let userString = '';
  try {
    userString = JSON.stringify(user);
  } catch(err) {
    done(err);
    return;
  }
  const config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'iplanetDirectoryPro': tokenId,
    },
    body: userString,
  };
  const url = Settings.openam.baseUrl+Settings.openam.regPath;
  fetch(url, config).then(function(res) {
    return res.text();
  }).then(function(responseText) {
    let jsonData = {};
    try {
      jsonData = JSON.parse(responseText);
    } catch(err) {
      done(err);
      return;
    }
    if (jsonData.code !== 200) {
      done(jsonData.message);
      return;
    }
    done(null, responseText);
  }).catch(function(err) {
    done(err);
  });
};

/**
 *
 * Parse register a user with a parse-server
 *
 * @param {string} email, the email of the user
 * @param {string} password, the users plain text password
 * @param {object} props, optiona key-value properties of the user account
 * @param {function} done, the function to execute when done
 */
function parseRegister(email, password, props, done) {
  Parse.User.signUp(email, password, props).then(
    function(user) {
      done(null, user);
    },
    function(err) {
      if (err.hasOwnProperty('message')) {
        done(err.message);
        return;
      }
      done('Error with signup process. Try again later.');
    }
  );
};

/**
 * logs the user out of parse
 */
export function logout() {
  Parse.User.logOut();
};

/**
 * is the current email registered
 *
 * @param {function} done, the function to execute when done
 */
export function isRegistered(email, done) {
  const query = new Parse.Query(Parse.User);
  query.equalTo('username', email);
  query.find({
    success: function(user) {
      if (user.length) {
        done(null, true);
        return;
      }
      done(null, false);
    },
    error: function(err) {
      done(err);
    }
  });
};

/**
 *
 * @param {string} email, the email of the user
 * @param {string} password, the users plain text password
 * @param {object} props, optiona key-value properties of the user account
 */
export function register(email, password, props, done) {
  async.auto({
    // determine if the email is registered
    registered: function(cb) {
      isRegistered(email, cb);
    },
    //authenticates against openam as admin
    openamAuth: ['registered', function(cb, results) {
      if (Settings.dev) return cb(null, true);
      if (results.registered) {
        cb('The email is already registered.');
        return;
      }
      openamAuth(cb);
    }],
    //register a user with openAm
    openamRegister: ['openamAuth', function(cb, results) {
      if (Settings.dev) return cb(null, true);
      const user = {
        username: email,
        userpassword: password,
        email: email,
      };
      openamRegister(user, results.openamAuth, cb);
    }],
    //register a user with parse
    parseRegister: ['openamRegister', function(cb, results) {
      parseRegister(email, password, props, cb);
    }],
  }, function(err, results) {
    if (err) {
      done(err);
      return;
    }
    // it was successful, registration will automatically login the user, we
    // can call logout() and force them to authenticate
    done(null, true);
  });
};

/**
 * update the users profile information
 *
 * @param {string} name, the users full name
 * @param {string} phone, the users phone number
 * @param {function} done, the function to execute when done
 */
export function updateProfile(name, phone, done) {
  currentUser(function(err, user) {
    if (err) {
      done(false);
    }
    user.save({
      name: name,
      phone: phone,
    }).then(
      function(user) {
        done(null, user);
      },
      function(err) {
        done(err);
      }
    );
  });
};

/**
 * Checks for the current logged in user, navigates back to the login page if verification fails.
 */
export function validateUser() {
  isAuthenticated((isValidUser) => {
    if (!isValidUser) {
      console.log('User validation failed, returning to login screen.')
      logout()
      Store.navigator.resetTo({path: 'login', title: ''})
    }
  })
}
