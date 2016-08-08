/* global fetch */
import Parse from 'parse/react-native';
import Store from '../data/Store';
import async from 'async';
import Settings from '../settings';
import { addUserToInstallation } from '../api/Installations';

let _currentUser = null;
const _networkTimeout = Settings.networkTimeout || 10000;
let _timer = null;

/**
 * Callback 'done' is stanard node.js style (err, res)
 *
 * @callback done
 * @param {object} err, an error or undefined
 * @param {object} res, the result
 */

/**
 * Callback 'isValidCb' is a single boolean valid
 * @callback isValidCb
 * @param {boolean} res, the result
 */

/**
 * authenticates against openam then parse
 *
 * @param {string} username, the username (email)
 * @param {string} password, the password
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function authenticate(username, password, done) {
  let timeout = false;
  clearTimeout(_timer);
  _timer = setTimeout(() => {
    timeout = true;
    done('Network Timeout');
  }, _networkTimeout);
  async.auto({
    // authenticates against openam
    openam: (cb) => {
      if (Settings.dev) {
        return cb(null, true);
      }
      const authConfig = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-OpenAM-Username': username,
          'X-OpenAM-Password': password,
        },
      };
      const url = Settings.openam.baseUrl + Settings.openam.authPath;
      fetch(url, authConfig).then((res) => {
        if (!res.ok) {
          cb('Unauthorized');
          return;
        }
        cb(null, res);
      }).catch(() => {
        cb('Unauthorized');
      });
    },
    // authenticates against parse
    parse: ['openam', (cb) => {
      Parse.User.logIn(username, password).then(
        (user) => {
          cb(null, user);
        },
        (err) => {
          if (err.hasOwnProperty('code') && err.code === 100) {
            return cb('Network Timeout');
          }
          cb('Unauthorized');
        }
      ).catch(() => {
        cb('Network Error');
      });
    }],
  }, (err, results) => {
    if (!timeout) {
      clearTimeout(_timer);
      if (err) {
        done(err);
        return;
      }
      done(null, results.parse);
    }
  });
}

/**
 * is the current parse user authenticated
 *
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function currentUser(done) {
  if (_currentUser !== null) {
    return done(null, _currentUser);
  }
  Parse.User.currentAsync().then((user) => {
    if (user && typeof user.getSessionToken() !== 'undefined') {
      _currentUser = user;
      done(null, user);
    } else {
      done('Invalid User');
    }
  },
  () => {
    done('Invalid User');
  });
}

/**
 * is the current parse user authenticated
 *
 * @param {isValidCb} isValidCb, the function to execute when done
 * @returns {undefined}
 */
export function isAuthenticated(isValidCb) {
  currentUser((err, user) => {
    if (err) {
      isValidCb(false);
    } else {
      isValidCb(true, user);
    }
  });
}

/**
 *
 * OpenAm admin authentication to get session of authorized user who is capable
 * of creating user accounts.
 *
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
function openamAuth(done) {
  const openAmEmail = Settings.openam.email;
  const openAmPassword = Settings.openam.password;
  const authConfig = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-OpenAM-Username': openAmEmail,
      'X-OpenAM-Password': openAmPassword,
    },
  };
  const url = Settings.openam.baseUrl + Settings.openam.authPath;
  fetch(url, authConfig).then((res) => {
    return res.text();
  }).then((responseText) => {
    const jsonData = JSON.parse(responseText);
    if (!jsonData.hasOwnProperty('tokenId')) {
      done('Invalid tokenId');
      return;
    }
    done(null, jsonData.tokenId);
  }).catch(() => {
    done('Unauthorized');
  });
}

/**
 *
 * OpenAm register a user with a valid tokenId
 *
 * @param {object} user, the user object to create an openam profile
 * @param {string} tokenId, the admin tokenId to sign the request
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
function openamRegister(user, tokenId, done) {
  let userString = '';
  try {
    userString = JSON.stringify(user);
  } catch (err) {
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
  const url = Settings.openam.baseUrl + Settings.openam.regPath;
  fetch(url, config).then((res) => {
    return res.text();
  }).then((responseText) => {
    let jsonData = {};
    try {
      jsonData = JSON.parse(responseText);
    } catch (err) {
      done(err);
      return;
    }
    if (jsonData.code !== 200) {
      done(jsonData.message);
      return;
    }
    done(null, responseText);
  }).catch((err) => {
    done(err);
  });
}

/**
 *
 * Parse register a user with a parse-server
 *
 * @param {string} email, the email of the user
 * @param {string} password, the users plain text password
 * @param {object} props, optiona key-value properties of the user account
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
function parseRegister(email, password, props, done) {
  Parse.User.signUp(email, password, props).then(
    (user) => {
      done(null, user);
    },
    (err) => {
      if (err.hasOwnProperty('message')) {
        done(err.message);
        return;
      }
      done('Error with signup process. Try again later.');
    }
  );
}

/**
 * logs the user out of parse
 * @returns {undefined}
 */
export function logout() {
  _currentUser = null;
  addUserToInstallation({id: ''}, () => {});
  Parse.User.logOut();
}

/**
 * is the current email registered
 *
 * @param {string} email, an email address
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function isRegistered(email, done) {
  const query = new Parse.Query(Parse.User);
  query.equalTo('username', email);
  query.find({
    success: (user) => {
      if (user.length) {
        done(null, true);
        return;
      }
      done(null, false);
    },
    error: (err) => {
      done(err);
    },
  });
}

/**
 *
 * @param {string} email, the email of the user
 * @param {string} password, the users plain text password
 * @param {object} props, optiona key-value properties of the user account
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function register(email, password, props, done) {
  async.auto({
    // determine if the email is registered
    registered: (cb) => {
      isRegistered(email, cb);
    },
    // authenticates against openam as admin
    openamAuth: ['registered', (cb, results) => {
      if (Settings.dev) {
        return cb(null, true);
      }
      if (results.registered) {
        return cb('The email is already registered.');
      }
      openamAuth(cb);
    }],
    // register a user with openAm
    openamRegister: ['openamAuth', (cb, results) => {
      if (Settings.dev) {
        return cb(null, true);
      }
      const user = {
        username: email,
        userpassword: password,
        email: email,
      };
      openamRegister(user, results.openamAuth, cb);
    }],
    // register a user with parse
    parseRegister: ['openamRegister', (cb) => {
      parseRegister(email, password, props, cb);
    }],
  }, (err) => {
    if (err) {
      done(err);
      return;
    }
    // it was successful, registration will automatically login the user, we
    // can call logout() and force them to authenticate
    done(null, true);
  });
}

/**
 * update the users profile information
 *
 * @param {string} name, the users full name
 * @param {string} phone, the users phone number
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function updateProfile(name, phone, done) {
  currentUser((err1, user) => {
    if (err1) {
      done(false);
      return;
    }
    user.save({
      name: name,
      phone: phone,
    }).then(
      (res) => {
        done(null, res);
      },
      (err2) => {
        done(err2);
      }
    );
  });
}

/**
 * Checks for the current logged in user, navigates back to the login page if verification fails.
 * @returns {undefined}
 */
export function validateUser() {
  isAuthenticated((isValidUser) => {
    if (!isValidUser) {
      logout();
      Store.navigator.resetTo({path: 'login', title: ''});
    }
  });
}
