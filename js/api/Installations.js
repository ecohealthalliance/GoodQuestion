import Parse from 'parse/react-native';
import async from 'async';
import Settings from '../settings';
import { version, name } from '../../package';
import { currentUser } from './Account';

/**
 * find a single installation object using REST API and masterKey
 *
 * @param {string} installationId, the installation id for the record
 */
function findInstallation(installationId, done) {
  const errorMsg = `Could not find installation object with installationId: ${installationId}`;
  const authConfig = {
    method: 'GET',
    headers: {
      'X-Parse-Application-Id': Settings.parse.appId,
      'X-Parse-Master-Key': Settings.parse.masterKey,
      'Content-Type': 'application/json',
    },
  };
  const encoded = encodeURIComponent(JSON.stringify({installationId: installationId}));
  const url = `${Settings.parse.serverUrl}/installations?where=${encoded}`;
  fetch(url, authConfig).then((res) => {
    if (!res.ok) {
      // no results
      done(null, null);
      return;
    }
    return res.text();
  }).then((responseText) => {
    let jsonData = {};
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      done(e.message);
      return;
    }
    if (!jsonData.hasOwnProperty('results') || !Array.isArray(jsonData.results) || jsonData.results.length <= 0) {
      // no results
      done(null, null);
      return;
    }
    done(null, jsonData.results[0]);
  }).catch((e) => {
    if (e.hasOwnProperty('message')) {
      done(e.message);
      return;
    }
    done(errorMsg);
  });
}

/**
 * update the installation object using REST API and masterKey
 *
 * @param {Object} installation, the JavaScript object for the record
 */
function updateInstallation(installation, user, done) {
  const errorMsg = `Could not update installation object: ${installation.objectId}`;
  const parseVersion = Parse.CoreManager.get('VERSION');
  const update = {
    appName: name,
    appVersion: version,
    parseVersion: parseVersion,
    userId: user.id,
  };
  let runCount = installation.runCount;
  if (typeof runCount === 'undefined') {
    runCount = 0;
  }
  if (installation.platform === 'android') {
    update.pushType = 'gcm';
  }
  if (installation.platform === 'ios') {
    update.badge = 0;
  }
  update.runCount = ++runCount;
  const authConfig = {
    method: 'PUT',
    headers: {
      'X-Parse-Application-Id': Settings.parse.appId,
      'X-Parse-Master-Key': Settings.parse.masterKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  };
  const url = `${Settings.parse.serverUrl}/installations/${installation.objectId}`;
  fetch(url, authConfig).then((res) => {
    if (!res.ok) {
      done(errorMsg);
      return;
    }
    return res.text();
  }).then((responseText) => {
    let jsonData = {};
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      done(e);
      return;
    }
    if (!jsonData.hasOwnProperty('updatedAt')) {
      done(errorMsg);
      return;
    }
    done(null, jsonData);
  }).catch((e) => {
    if (e.hasOwnProperty('message')) {
      done(e.message);
      return;
    }
    done(errorMsg);
  });
}

/**
 * update the installation object using REST API and masterKey
 *
 * @param {Object} installation, the JavaScript object for the record
 */
function createInstallation(installationId, user, tokenId, platform, done) {
  const errorMsg = `Could not create installation object with installationId: ${installationId}`;
  const parseVersion = Parse.CoreManager.get('VERSION');
  const installation = {
    appName: name,
    appVersion: version,
    appIdentifier: Settings.identifier,
    deviceToken: tokenId,
    deviceType: platform,
    installationId: installationId,
    parseVersion: parseVersion,
    runCount: 1,
    userId: user.id,
  };
  if (platform === 'android') {
    installation.pushType = 'gcm';
  }
  if (platform === 'ios') {
    installation.badge = 0;
  }
  const authConfig = {
    method: 'POST',
    headers: {
      'X-Parse-Application-Id': Settings.parse.appId,
      'X-Parse-Master-Key': Settings.parse.masterKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(installation),
  };
  const url = `${Settings.parse.serverUrl}/installations`;
  fetch(url, authConfig).then((res) => {
    if (!res.ok) {
      done(errorMsg);
      return;
    }
    return res.text();
  }).then((responseText) => {
    let jsonData = {};
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      done(e);
      return;
    }
    if (Object.keys(jsonData).length <= 0) {
      done(errorMsg);
      return;
    }
    done(null, jsonData);
  }).catch((e) => {
    if (e.hasOwnProperty('message')) {
      done(e.message);
      return;
    }
    done(errorMsg);
  });
}

/**
 * create an installation object using parse-server rest API
 *
 * @param {string} tokenId
 * @param {string} platform
 * @param {function} the function to execute when done
 */
export function upsertInstallation(tokenId, platform, done) {
  async.auto({
    // get the installationId from Parse
    id: (cb) => {
      Parse._getInstallationId().then((id) => {
        cb(null, id);
      }).catch((e) => {
        cb(e);
      });
    },
    // get the current user
    user: ['id', (cb) => {
      currentUser((err, user) => {
        if (err) {
          if (err === 'Invalid User') {
            // create an installation object even with an unauthenticated user
            // by sending an object with an empty id
            cb(null, { id: '' });
          } else {
            cb(err);
          }
          return;
        }
        cb(null, user);
      });
    }],
    // find existing installation object
    find: ['user', (cb, results) => {
      const installationId = results.id;
      findInstallation(installationId, cb);
    }],
    // save or update the installation object
    save: ['find', (cb, results) => {
      if (results.find === null) {
        createInstallation(results.id, results.user, tokenId, platform, cb);
      } else {
        updateInstallation(results.find, results.user, cb);
      }
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.save);
  });
}


/**
 * adds the authenticated user to the installation object using parse-server rest API
 *
 * @param {object} user, the current user
 * @param {function} the function to execute when done
 */
export function addUserToInstallation(user, done) {
  async.auto({
    // get the installationId from Parse
    id: (cb) => {
      Parse._getInstallationId().then((id) => {
        cb(null, id);
      }).catch((e) => {
        cb(e);
      });
    },
    // find existing installation object
    find: ['id', (cb, results) => {
      const installationId = results.id;
      findInstallation(installationId, cb);
    }],
    // save or update the installation object
    save: ['find', (cb, results) => {
      if (results.find === null) {
        cb('No installation exists');
      } else {
        updateInstallation(results.find, user, cb);
      }
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.save);
  });
}
