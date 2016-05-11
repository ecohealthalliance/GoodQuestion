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
}

/**
 * is the current parse user authenticated
 *
 * @param {function} the function to execute when done
 */
export function isAuthenticated(done) {
  Parse.User.currentAsync().then(
    function(user) {
      if (user && typeof user.getSessionToken() !== 'undefined') {
        done(true);
        return;
      }
      done(false);
    },
    function(err) {
      console.error(err);
      done(false);
    }
  );
};
