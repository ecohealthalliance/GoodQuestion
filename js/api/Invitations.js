import Parse from 'parse/react-native'
import realm from '../data/Realm'
import {currentUser} from '../api/Account'
import crypto from 'crypto-js'
import async from 'async'

const Invitation = Parse.Object.extend('Invitation');
export const InvitationStatus = {
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  PENDING: 'pending',
};


/**
 * user may only have one submission for each formId
 *
 * @param {string} formId, the unique id for the parse form record
 * @param {object} currentUser, the current parse user saved to AsyncStorage
 */
function genInvitationId(surveyId, currentUser, done) {
  const str = '' + currentUser.id + surveyId;
  const id = crypto.MD5(str).toString();
  done(null, id);
};

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
  const invitations = realm
    .objects('Invitation')
    .filtered(`uniqueId == "${id}"`);
  if (invitations.length > 0) {
    const invitation = invitations[0];
    try {
      realm.write(() => {
        invitation.dirty = true;
        invitation.status = status;
      });
      done(null, invitation);
    } catch(e) {
      done('Error updating realm invitation ' + id);
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
      }, true);
      done(null, invitation);
    } catch(e) {
      done('Error saving realm invitation ' + id);
    }
  });
};

/**
 * create a invitation on parse-server
 * TODO the server should be initiating invitations, we are creating the uniqueId
 * client-side.
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} surveyId, the unique id for the parse form record
 * @param {object} currentUser, the current user
 * @param {string} status, the invitation status
 */
function createParseInvitation(id, surveyId, currentUser, status, done) {
  const invitation = new Invitation();
  invitation.set('uniqueId', id);
  invitation.set('surveyId', surveyId);
  invitation.set('status', status);
  invitation.set('userId', currentUser.id);
  const query = new Parse.Query(Parse.Role)
  query.equalTo('name', 'admin')
  query.find(
    (roles) => {
      if (roles.length <= 0) return done('Invalid role.');
      const role = roles[0];
      const acl = new Parse.ACL();
      acl.setReadAccess(currentUser, true);
      acl.setWriteAccess(currentUser, true);
      acl.setRoleReadAccess(role, true);
      acl.setRoleWriteAccess(role, true);
      invitation.setACL(acl);
      invitation.save(null).then(
        (s) => {
          done(null, s);
        },
        (e) => {
          done('Error synchronizing to remote server.');
        }
      );
    },
    (e) => {
      done('Invalid role.')
    }
  );
};

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
      (e) => {
        done('Error synchronizing to remote server.');
      }
    );
  } else {
    done('Invalid invitation instance type')
  }
};

/**
 * find an invitation on parse by uniqueId
 *
 * @param {string} id, the unique id for the record
 */
function findParseInvitation(id, done) {
  const query = new Parse.Query(Invitation);
  query.equalTo('uniqueId', id);
  query.find({
    success: function(invitations) {
      if (invitations.length > 0) {
        done(null, invitations[0]);
        return;
      }
      done(null, null);
    },
    error: function(err) {
      done('No results');
    }
  });
}

/**
 * mark a local realm invitation clean
 *
 * @param {string} id, the unique id for the realm record
 */
function markRealmInvitationClean(id, done) {
  const invitations = realm
    .objects('Invitation')
    .filtered(`uniqueId = "${id}"`);
  if (invitations.length > 0) {
    try {
      const invitation = invitations[0];
      realm.write(() => {
        invitation.dirty = false;
      });
      done(null, invitation);
    } catch(e) {
      done('Error update realm invitation ' + id)
    }
  } else {
    done('Invitation does not exist');
  }
};

/**
 * Accept an invatation to a survey
 *
 * @param {string} surveyId, the id of the survey to be status
 * @param {string} status, the invitation status
 */
export function markInvitationStatus(surveyId, status, done) {
  if (typeof status !== 'string' || !InvitationStatus.hasOwnProperty(status.toUpperCase()))  {
    console.warn(`Invalid status type: ${status}`)
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
    }]
  }, (err, results) => {
    if (typeof done !== 'function') return;
    if (err) {
      done(err);
      return;
    }
    done(null, 'The invitation was saved.');
  });
};

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
      const invitations = realm
        .objects('Invitation')
        .filtered(`surveyId == "${surveyId}" AND userId == "${userId}"`);
      if (invitations.length > 0) {
        cb(null, invitations[0]);
      } else {
        cb('Invitation does not exist');
      }
    }]
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.invitation);
  });
};

/**
 * load all cached invitations for the current user
 *
 * @param {string} surveyId, the unique id for the survey
 */
export function loadCachedInvitations(surveys, done) {
  const surveyIds = _.map(surveys, (survey) => { return survey.id });
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    // find any existing cached invitations by surveyIds and userId
    findExisting: ['currentUser', (cb, results) => {
      const userId = results.currentUser.id;
      let invitations = []
      if (surveyIds.length > 0) {
        invitations = realm
          .objects('Invitation')
          .filtered(`userId == "${userId}"`)
          .filtered(surveyIds.map((id) => `surveyId == "${id}"`).join(' OR '));
      }
      cb(null, invitations);
    }],
    // create a default installation object with STATE.PENDING if one does not
    // exist for a survey
    create: ['findExisting', (cb, results) => {
      const existingIds = _.map(results.findExisting, (invitation) => { return invitation.surveyId });
      const difference = _.difference(surveyIds, existingIds);
      difference.forEach((id) => { markInvitationStatus(id, InvitationStatus.PENDING) })
      cb(null, difference);
    }],
    join: ['create', (cb, results) => {
      if (results.create.length <= 0) return cb(null, results.findExisting);
      const userId = results.currentUser.id;
      let invitations = []
      if (surveyIds.length > 0) {
        invitations = realm
          .objects('Invitation')
          .filtered(`userId == "${userId}"`)
          .filtered(surveyIds.map((id) => `surveyId == "${id}"`).join(' OR '));
      }
      cb(null, invitations);
    }]
    //
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.join);
  });
};

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
      const invitations = realm
        .objects('Invitation')
        .filtered(`userId == "${userId}"`)
        .filtered('status == "accepted"');
      cb(null, invitations);
    }]
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.invitation);
  });
};

/**
 * clears the invitation cache, excluding dirty invitations
 */
export function clearInvitationCache() {
  const invitations = realm.objects('Invitation').filtered('dirty == false');
  if (invitations.length >= 0) {
    realm.write(() => {
      realm.delete(invitations)
    });
  }
};



/**
 * loads invitations from the remote server
 *
 * @return {object} Realm.Result of the new cached objects
 */
export function loadInvitations(done) {
  const query = new Parse.Query(Invitation);
  query.find({
    success: function(invitations) {
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
            savedInvitations++
          } catch(e) {
            failedInvitations++
            console.warn(e);
          }
          if (savedInvitations + failedInvitations === numInvitations) {
            done(null, invitations);
          }
        });
      } else {
        done(null, []);
      }
    },
    error: function(err) {
      done(err);
    }
  });
};
