import async from 'async';
import { currentUser } from '../api/Account';
import { loadDirtySubmissions, propagateSubmissions } from '../api/Submissions';
import { loadDirtyInvitations, propagateInvitations } from '../api/Invitations';

/**
 * service that checks for dirty invitations and submissions and attempts to
 * propagate them to the remote server (in bulk)
 *
 * @param {function} done, in node.js format (err, res)
 */
export function checkDirtyObjects(done) {
  async.auto({
    // get the current user of our multi-user application
    currentUser: (cb) => {
      currentUser(cb);
    },
    // checks for dirty Invitations
    dirtyInvitations: ['currentUser', (cb) => {
      loadDirtyInvitations(cb);
    }],
    // checks for dirty submissions
    dirtySubmissions: ['currentUser', (cb) => {
      loadDirtySubmissions(cb);
    }],
    // marks any dirty invitations as clean
    cleanedInvitations: ['dirtyInvitations', (cb, results) => {
      const numDirty = results.dirtyInvitations.length;
      if (numDirty > 0) {
        propagateInvitations(results.dirtyInvitations, (err, res) => {
          if (err) {
            return cb(null, 0);
          }
          cb(null, res);
        });
      } else {
        cb(null, 0);
      }
    }],
    // marks any dirty submissions as clean
    cleanedSubmissions: ['dirtySubmissions', (cb, results) => {
      const numDirty = results.dirtySubmissions.length;
      if (numDirty > 0) {
        propagateSubmissions(results.dirtySubmissions, (err, res) => {
          if (err) {
            return cb(null, 0);
          }
          cb(null, res);
        });
      } else {
        cb(null, 0);
      }
    }],
  }, (err, results) => {
    if (done && typeof done === 'function') {
      if (err) {
        return done(err);
      }
      return done(null, results);
    }
  });
}
