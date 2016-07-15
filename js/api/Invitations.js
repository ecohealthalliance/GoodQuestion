import Parse from 'parse/react-native';
import realm from '../data/Realm';
import {currentUser} from '../api/Account';
import { adminRole } from '../api/Roles';
import crypto from 'crypto-js';
import async from 'async';
import _ from 'lodash';

export const InvitationStatus = {
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  PENDING: 'pending',
};
const Invitation = Parse.Object.extend('Invitation');
/**
 * create an invitation Object with acl assigned
 *
 * @param {string} uniqueId, the unique id for the realm record
 * @param {string} surveyId, the unique id for the parse form record
 * @param {string} status, the invitation status
 * @param {object} user, the current parse user saved to AsyncStorage
 * @param {object} role, the adminRole to be assigned to the object
 */
Invitation.create = function create(uniqueId, surveyId, status, user, role) {
  const invitation = new Invitation();
  invitation.set('uniqueId', uniqueId);
  invitation.set('surveyId', surveyId);
  invitation.set('status', status);
  invitation.set('userId', user.id);
  const acl = new Parse.ACL();
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  acl.setRoleReadAccess(role, true);
  acl.setRoleWriteAccess(role, true);
  invitation.setACL(acl);
  return invitation;
};

/**
 * user may only have one submission for each formId
 *
 * @param {string} formId, the unique id for the parse form record
 * @param {object} user, the current parse user saved to AsyncStorage
 *
 */
function genInvitationId(surveyId, user, done) {
  const str = `${user.id}${surveyId}`;
  const id = crypto.MD5(str).toString();
  done(null, id);
}

/**
 * upsert a invitation to the local realm database
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} formId, the unique id for the parse form record
 * @param {string} userId, the id of the current user
 * @param {string} status, the invitation status
 * @param {boolean} dirty, mark the invitation dirty
 */
function upsertRealmInvitation(id, surveyId, userId, status, dirty, done) {
  const invitations = realm.objects('Invitation').filtered(`uniqueId == "${id}"`);
  if (invitations.length > 0) {
    const invitation = invitations[0];
    try {
      realm.write(() => {
        invitation.dirty = true;
        invitation.status = status;
      });
      done(null, invitation);
    } catch (e) {
      done(`Error updating realm invitation ${id}`);
    }
    return;
  }

  realm.write(() => {
    try {
      const invitation = realm.create('Invitation', {
        uniqueId: id,
        userId: userId,
        surveyId: surveyId,
        dirty: true,
        status: status,
      });
      done(null, invitation);
    } catch (e) {
      done(`Error saving realm invitation ${id}`);
    }
  });
}

/**
 * create a invitation on parse-server
 * TODO the server should be initiating invitations, we are creating the uniqueId
 * client-side.
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} surveyId, the unique id for the parse form record
 * @param {object} user, the current user
 * @param {string} status, the invitation status
 */
function createParseInvitation(id, surveyId, user, status, done) {
  adminRole((err, role) => {
    if (err) {
      done('Invalid role.');
      return;
    }
    const invitation = Invitation.create(id, surveyId, status, user, role);
    invitation.save(null).then(
      (s) => {
        done(null, s);
      },
      () => {
        done('Network Error');
      }
    );
  });
}

/**
 * update an existing invitation on parse-server
 *
 * @param {object} invitation, a Parse.Object instance
 * @param {string} status, the invitation status
 */
function updateParseInvitation(invitation, status, done) {
  if (invitation instanceof Parse.Object) {
    invitation.save({status: status}).then(
      (s) => {
        done(null, s);
      },
      () => {
        done('Network Error');
      }
    );
  } else {
    done('Invalid invitation instance type');
  }
}

/**
 * find an invitation on parse by uniqueId
 *
 * @param {string} id, the unique id for the record
 */
function findParseInvitation(id, done) {
  const query = new Parse.Query(Invitation);
  query.equalTo('uniqueId', id);
  query.find(
    (invitations) => {
      if (invitations && invitations.length) {
        done(null, invitations[0]);
        return;
      }
      done(null, null);
    },
    () => {
      done('Network Error');
    }
  );
}

/**
 * finds invitations on parse by array of uniqueIds
 *
 * @param {array} uniqueIds, the unique ids for the records
 * @param {function} done, the callback in node.js format (err, res)
 */
function findParseInvitations(uniqueIds, done) {
  const query = new Parse.Query(Invitation);
  query.containedIn('uniqueId', uniqueIds);
  query.find(
    (invitations) => {
      if (invitations && invitations.length) {
        done(null, invitations);
        return;
      }
      done(null, null);
    },
    () => {
      done('Network Error');
    }
  );
}

/**
 * mark a local realm invitation clean
 *
 * @param {string} id, the unique id for the realm record
 */
function markRealmInvitationClean(id, done) {
  const invitations = realm.objects('Invitation').filtered(`uniqueId = "${id}"`);
  if (invitations.length > 0) {
    try {
      const invitation = invitations[0];
      realm.write(() => {
        invitation.dirty = false;
      });
      done(null, invitation);
    } catch (e) {
      done(`Error update realm invitation ${id}`);
    }
  } else {
    done('Invitation does not exist');
  }
}

/**
 * Accept an invatation to a survey
 *
 * @param {string} surveyId, the id of the survey to be status
 * @param {string} status, the invitation status
 */
export function markInvitationStatus(surveyId, status, done) {
  if (typeof status !== 'string' || !InvitationStatus.hasOwnProperty(status.toUpperCase())) {
    console.warn(`Invalid status type: ${status}`);
    return;
  }
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    id: ['currentUser', (cb, results) => {
      genInvitationId(surveyId, results.currentUser, cb);
    }],
    // save to realm and mark dirty
    dirty: ['id', (cb, results) => {
      upsertRealmInvitation(results.id, surveyId, results.currentUser.id, status, true, cb);
    }],
    // TODO use cloud code for perform upsert vs. find then save
    // https://gist.github.com/kevinzhang96/1d4680b953e33342f6ab
    find: ['dirty', (cb, results) => {
      findParseInvitation(results.id, cb);
    }],
    // save to parse, if successful mark clean
    save: ['find', (cb, results) => {
      if (results.find === null) {
        createParseInvitation(results.id, surveyId, results.currentUser, status, cb);
      } else {
        updateParseInvitation(results.find, status, cb);
      }
    }],
    // mark the local submission as clean
    clean: ['save', (cb, results) => {
      markRealmInvitationClean(results.id, cb);
    }],
  }, (err) => {
    if (typeof done !== 'function') {
      return;
    }
    if (err) {
      if (err === 'Network Error') {
        return done(null, 'The invitation was saved locally.');
      }
      return done(err);
    }
    done(null, 'The invitation was saved.');
  });
}

/**
 * load a single cached invitation for the current user
 *
 * @param {string} surveyId, the unique id for the survey
 */
export function loadCachedInvitation(surveyId, done) {
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    invitation: ['currentUser', (cb, results) => {
      const userId = results.currentUser.id;
      const invitations = realm.objects('Invitation').filtered(`surveyId == "${surveyId}" AND userId == "${userId}"`);
      if (invitations.length > 0) {
        cb(null, invitations[0]);
      } else {
        cb('Invitation does not exist');
      }
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.invitation);
  });
}

/**
 * load all cached invitations for the current user
 *
 * @param {string} surveyId, the unique id for the survey
 */
export function loadCachedInvitations(surveys, done) {
  const surveyIds = _.map(surveys, (survey) => {
    return survey.id;
  });
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    // find any existing cached invitations by surveyIds and userId
    findExisting: ['currentUser', (cb, results) => {
      const userId = results.currentUser.id;
      let invitations = [];
      if (surveyIds.length > 0) {
        invitations = realm.objects('Invitation').filtered(
          `userId == "${userId}"`).filtered(
            surveyIds.map((id) => `surveyId == "${id}"`).join(' OR '));
      }
      cb(null, invitations);
    }],
    // create a default installation object with STATE.PENDING if one does not
    // exist for a survey
    create: ['findExisting', (cb, results) => {
      const existingIds = _.map(results.findExisting, (invitation) => {
        return invitation.surveyId;
      });
      const difference = _.difference(surveyIds, existingIds);
      difference.forEach((id) => {
        markInvitationStatus(id, InvitationStatus.PENDING);
      });
      cb(null, difference);
    }],
    join: ['create', (cb, results) => {
      if (results.create.length <= 0) {
        return cb(null, results.findExisting);
      }
      const userId = results.currentUser.id;
      let invitations = [];
      if (surveyIds.length > 0) {
        invitations = realm.objects('Invitation').filtered(
          `userId == "${userId}"`).filtered(
            surveyIds.map((id) => `surveyId == "${id}"`).join(' OR '));
      }
      cb(null, invitations);
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.join);
  });
}

/**
 * find local realm invitations
 *
 * @param {string} surveyId, the unique id for the survey
 */
export function loadAcceptedInvitations(done) {
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    invitation: ['currentUser', (cb, results) => {
      const userId = results.currentUser.id;
      const invitations = realm.objects('Invitation').filtered(
        `userId == "${userId}"`).filtered('status == "accepted"');
      cb(null, invitations);
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.invitation);
  });
}

/**
 * clears the invitation cache, excluding dirty invitations
 */
export function clearInvitationCache() {
  const invitations = realm.objects('Invitation').filtered('dirty == false');
  if (invitations.length >= 0) {
    realm.write(() => {
      realm.delete(invitations);
    });
  }
}

/**
 * loads invitations from the remote server
 *
 * @return {object} Realm.Result of the new cached objects
 */
export function loadInvitations(done) {
  const query = new Parse.Query(Invitation);
  query.find(
    (invitations) => {
      if (invitations && invitations.length >= 0) {
        clearInvitationCache();
        const numInvitations = invitations.length;
        let savedInvitations = 0;
        let failedInvitations = 0;
        if (numInvitations > 0) {
          invitations.forEach((invitation) => {
            try {
              realm.write(() => {
                realm.create('Invitation', {
                  uniqueId: invitation.get('uniqueId'),
                  userId: invitation.get('userId'),
                  surveyId: invitation.get('surveyId'),
                  status: invitation.get('status'),
                  dirty: false,
                });
              });
              savedInvitations++;
            } catch (e) {
              // we do not 'upsert' on an existing invitations else we will
              // have data loss when offline
              console.warn(e);
              failedInvitations++;
            }
            if (savedInvitations + failedInvitations === numInvitations) {
              done(null, invitations);
            }
          });
        }
        return;
      }
      done(null, []);
    },
    (err) => {
      done(err);
    }
  );
}

/**
 * loads all cached invitations for the currentthat are marked dirty
 */
export function loadDirtyInvitations(done) {
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    invitations: ['currentUser', (cb, results) => {
      const userId = results.currentUser.id;
      const invitations = realm.objects('Invitation').filtered(
        `userId == "${userId}"`).filtered('dirty == true');
      cb(null, invitations);
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.invitations);
  });
}

/**
 * attempt to save multiple chached invitations to the remote then mark as
 * clean locally
 *
 * @param {array} invitations, array of realm.io model results
 * @callback {function} done, the callback method in node.js format (err, res)
 */
export function propagateInvitations(invitations, done) {
  const dirty = invitations.slice();
  const uniqueIds = dirty.map((d) => d.uniqueId);
  async.auto({
    // get the current user
    currentUser: (cb) => {
      currentUser(cb);
    },
    // get the admin role
    adminRole: ['currentUser', (cb) => {
      adminRole(cb);
    }],
    // find existing parse objects
    combined: ['adminRole', (cb, results) => {
      findParseInvitations(uniqueIds, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res === null) {
          done('Network Error');
          return;
        }
        if (res && res.length > 0) {
          // what are the existing uniqueIds on the server
          const existingIds = res.map((e) => {
            return e.get('uniqueId');
          });
          // what is the difference between the cache and server
          const difference = _.difference(uniqueIds, existingIds);
          // get any realm.io submissions that do not exist on the server?
          const filtered = dirty.filter((d) => {
            return difference.indexOf(d.uniqueId) >= 0;
          });
          // create the missing remote objects and add to an array
          const missing = [];
          filtered.forEach((d) => {
            missing.push(Invitation.create(d.uniqueId, d.surveyId, d.state, results.currentUser, results.adminRole));
          });
          // update the existing answers
          res.forEach((e) => {
            const s = dirty.filter((d) => {
              return d.uniqueId === e.get('uniqueId');
            })[0];
            if (typeof s !== 'undefined') {
              e.set('status', s.status);
            }
          });
          // combine all
          const combined = _.union(res, missing);
          cb(null, combined);
          return;
        }
        cb(null, []);
      });
    }],
    // save all the objects in one http request
    saveAll: ['combined', (cb, results) => {
      const combined = results.combined;
      const total = combined.length;
      if (total > 0) {
        Parse.Object.saveAll(combined,
          () => {
            done(null, total);
          },
          (e) => {
            done(e);
          }
        );
      }
      cb(null, total);
    }],
    // mark the local invitation as clean
    clean: ['saveAll', (cb) => {
      const numDirty = invitations.length;
      let count = 0;
      realm.write(() => {
        invitations.forEach((invitation) => {
          count++;
          if (typeof invitation === 'undefined') {
            return;
          }
          invitation.dirty = false;
          if (numDirty === count) {
            cb(null, true);
          }
        });
      });
    }],
  }, (err, results) => {
    if (done && typeof done === 'function') {
      if (err) {
        if (err === 'Network Error') {
          return done(null, 'The invitation was saved locally.');
        }
        return done(err);
      }
      done(null, results.saveAll);
    }
  });
}
