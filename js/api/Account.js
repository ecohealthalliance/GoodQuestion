/* global fetch */
import Parse from 'parse/react-native';
import Store from '../data/Store';
import async from 'async';
import Settings from '../settings';

import { addUserToInstallation } from '../api/Installations';
import { resetGeofences } from '../api/Geofencing';
import ImagePicker from 'react-native-image-picker';

import pubsub from 'pubsub-js';
import {ProfileChannels, ProfileMessage} from '../models/messages/Profile';

import { PixelRatio } from 'react-native';

let _currentUser = null;
let _timer = null;
const _networkTimeout = Settings.networkTimeout || 10000;
const defaultAvatar = require('../images/profile_logo.png');
const openam = {
  baseUrl: Settings.openam.baseUrl,
  authPath: '/openam/json/authenticate?Content-Type=application/json',
  regPath: '/openam/json/users/?_action=create',
  changePasswordPath: (username) => `/openam/json/users/${username}?_action=changePassword`,
};

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
      const url = openam.baseUrl + openam.authPath;
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
  currentUser((err) => {
    if (err) {
      isValidCb(false);
    } else {
      isValidCb(true);
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
function openamAuth(username, password, done) {
  const authConfig = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-OpenAM-Username': username,
      'X-OpenAM-Password': password,
    },
  };
  const url = openam.baseUrl + openam.authPath;
  fetch(url, authConfig).then((res) => {
    return res.text();
  }).then((responseText) => {
    const jsonData = JSON.parse(responseText);
    console.log('openamAuth:jsonData: ', jsonData);
    if (!jsonData.hasOwnProperty('tokenId')) {
      if (jsonData.hasOwnProperty('message')) {
        done(jsonData.message);
        return;
      }
      done('Unauthorized');
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
  const url = openam.baseUrl + openam.regPath;
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
 * OpenAm change a users password
 *
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
function openamChangePassword(tokenId, username, currentPassword, newPassword, done) {
  const authConfig = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'iPlanetDirectoryPro': tokenId,
    },
    body: JSON.stringify({
      'currentpassword': currentPassword,
      'userpassword': newPassword,
    }),
  };
  const url = openam.baseUrl + encodeURI(openam.changePasswordPath(username));
  fetch(url, authConfig).then((res) => {
    if (typeof res === 'undefined') {
      throw new Error('Bad Request.');
    }
    return res.text();
  }).then((responseText) => {
    const jsonData = JSON.parse(responseText);
    // Forgerock does not provide descriptive errors for authorized requests
    // that failed changePassword, such as meeting minimum complexity requirements
    // or other password policies.
    // https://bugster.forgerock.org/jira/browse/OPENAM-6867
    if (jsonData.hasOwnProperty('code') && jsonData.code !== 200) {
      done(jsonData.message);
      return;
    }
    done(null, true);
  }).catch(() => {
    done('Unauthorized');
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
  // sending id of an empty string removes the user from the installation obj
  addUserToInstallation({id: ''}, () => {});
  // removes geofences upon logout
  resetGeofences(() => {});
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
      openamAuth(openam.email, openam.password, cb);
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
export function updateInformation(name, phone, done) {
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
 * update the users password
 *
 * @param {string} currentPassword, the users current password
 * @param {string} newPassword, the users new password
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function updatePassword(currentPassword, newPassword, done) {
  async.auto({
    // determine the currentUser
    currentUser: (cb) => {
      currentUser(cb);
    },
    // authenticates against openam as current user
    openamAuth: ['currentUser', (cb, results) => {
      if (Settings.dev) {
        return cb(null, true);
      }
      const username = results.currentUser.get('username');
      openamAuth(username, currentPassword, cb);
    }],
    // change password against openam
    openamChangePassword: ['openamAuth', (cb, results) => {
      if (Settings.dev) {
        return cb(null, true);
      }
      const tokenId = results.openamAuth;
      const username = results.currentUser.get('username');
      openamChangePassword(tokenId, username, currentPassword, newPassword, cb);
    }],
    // register a user with parse
    parseChangePassword: ['openamChangePassword', (cb, results) => {
      const user = results.currentUser;
      user.set('password', newPassword);
      user.save().then(
        (res) => {
          cb(null, res);
        },
        () => {
          // if saving to parse fails we must rollback the password on Forgerock
          const tokenId = results.openamAuth;
          const username = user.get('username');
          openamChangePassword(tokenId, username, newPassword, currentPassword, (err) => {
            // if the rollback fails the user will need to contact an
            // administrator to get their passwords to match in both Forgerock
            // and Parse Server.
            if (err) {
              cb({
                logout: true,
                message: 'Your account has been locked. Please email: \ngoodquestion@ecohealthalliance.org',
              });
              return;
            }
            // Otherwise, the user has an invalid parse session. Force a logout
            // and redirect to the login screen.
            cb({
              logout: true,
              message: 'Your session is no longer valid. Please login.',
            });
          });
        }
      );
    }],
  }, done);
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

/**
 * Gets the avatar of the current user
 *
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function getAvatarImage(done) {
  async.auto({
    user: (cb) => {
      currentUser(cb);
    },
    source: ['user', (cb, result) => {
      const avatarBase64 = result.user.get('avatarBase64');
      if (typeof avatarBase64 === 'string' && avatarBase64.substring(0, 23) === 'data:image/jpeg;base64,') {
        return cb(null, {uri: avatarBase64});
      }
      return cb(null, defaultAvatar);
    }],
  }, done);
}

 /**
  * Changes the avatar of the current user
  *
  * @param {object} component, the component ref to set the loading state upon async network request
  * @param {done} done, the function to execute when done
  * @returns {undefined}
  */
export function changeAvatarImage(component, done) {
  const options = {
    title: 'Select your Profile Image',
    maxWidth: PixelRatio.getPixelSizeForLayoutSize(180),
    maxHeight: PixelRatio.getPixelSizeForLayoutSize(180),
    allowsEditing: true,
  };
  async.auto({
    user: (cb) => {
      currentUser(cb);
    },
    image: ['user', (cb) => {
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          return cb('Canceled');
        }
        if (response.error) {
          return cb(response.error);
        }
        component.setState({isLoading: true});
        const data = `data:image/jpeg;base64,${response.data}`;
        cb(null, data);
      });
    }],
    save: ['image', (cb, result) => {
      let previousAvatar = null;
      if (result.user.get('avatarBase64')) {
        previousAvatar = result.user.get('avatarBase64');
      } else {
        previousAvatar = defaultAvatar;
      }
      result.user.set('avatarBase64', result.image);
      result.user.save().then(
        () => {
          cb(null, result.image);
        },
        (err) => {
          // an error occured, notify the user
          result.user.set('avatarBase64', previousAvatar);
          cb(err);
        }
      );
    }],
    pub: ['save', (cb, result) => {
      // Publish a Profile change message via pubsub
      const profileMessage = ProfileMessage.createFromObject({uri: result.save});
      pubsub.publish(ProfileChannels.CHANGE, profileMessage);
      cb(null, true);
    }],
  }, done);
}


/**
 * do a fetch to parse-server
 *
 * @param {string} url, the url to fetch
 * @param {string} authConfig, the object containing authentication headers
 * @param {done} done, the function to execute when done
 */
function doFetch(url, authConfig, done) {
  fetch(url, authConfig).then((res) => {
    return res.json();
  }).then((data) => {
    if (typeof data === 'undefined') {
      throw new Error('Invalid response.');
    }
    if (data.hasOwnProperty('error')) {
      done({message: data.error});
      return;
    }
    done(null, data);
  }).catch((e) => {
    if (e.hasOwnProperty('message')) {
      done(e.message);
      return;
    }
    done(e);
  });
}

/**
 * creates a forgotPassword code using cloud code REST api
 *
 * @param {object} params, the params to send as JSON
 * @param {string} params.email, the (username) email address of the account
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function forgotPassword(params, done) {
  const authConfig = {
    method: 'POST',
    headers: {
      'X-Parse-Application-Id': Settings.parse.appId,
      'X-Parse-Master-Key': Settings.parse.masterKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  const url = `${Settings.parse.serverUrl}/functions/createForgotPassword`;
  doFetch(url, authConfig, done);
}

/**
 * creates a forgotPassword code using cloud code REST api
 *
 * @param {object} params, the params to send as JSON
 * @param {string} params.email, the (username) email address of the account
 * @param {string} params.code, the code from the email used to verify the account
 * @param {done} done, the function to execute when done
 * @returns {undefined}
 */
export function verifyForgotPassword(params, done) {
  const authConfig = {
    method: 'POST',
    headers: {
      'X-Parse-Application-Id': Settings.parse.appId,
      'X-Parse-Master-Key': Settings.parse.masterKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  const url = `${Settings.parse.serverUrl}/functions/verifyForgotPassword`;
  doFetch(url, authConfig, done);
}
