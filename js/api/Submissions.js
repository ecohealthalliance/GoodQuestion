import Parse from 'parse/react-native';
import realm from '../data/Realm';
import { currentUser } from '../api/Account';
import { getUserLocationData } from './Geofencing';
import { adminRole } from '../api/Roles';
import { completeForm } from './Forms';
import crypto from 'crypto-js';
import async from 'async';
import _ from 'lodash';

const Submission = Parse.Object.extend('Submission');
/**
 * create a submission Object with acl assigned
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} formId, the unique id for the parse form record
 * @param {object} answers, the answers to the current form
 * @param {object} user, the current parse user saved to AsyncStorage
 * @param {object} role, the adminRole to be assigned to the object
 */
Submission.create = function create(uniqueId, formId, answers, user, geolocation, role) {
  const submission = new Submission();
  submission.set('uniqueId', uniqueId);
  submission.set('formId', formId);
  submission.set('answers', answers);
  submission.set('userId', user);
  submission.set('geolocation', JSON.stringify(geolocation));
  const acl = new Parse.ACL();
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  acl.setRoleReadAccess(role, true);
  acl.setRoleWriteAccess(role, true);
  submission.setACL(acl);
  return submission;
};

// Fetches the cached submissions related to a specific form
export function loadCachedSubmissions(formId) {
  return realm.objects('Submission').filtered(`formId = "${formId}"`).sorted('created');
}

/**
 * user may only have one submission for each formId
 *
 * @param {string} formId, the unique id for the parse form record
 * @param {object} user, the current parse user saved to AsyncStorage
 */
function genSubmissionId(formId, user, done) {
  const str = `${user.id}${formId}`;
  const id = crypto.MD5(str).toString();
  done(null, id);
}

/**
 * wrapper around Submission.create what will also save asychronously
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} formId, the unique id for the parse form record
 * @param {object} answers, the answers to the current form
 * @param {object} currentUser, the current parse user saved to AsyncStorage
 */
function createParseSubmission(id, formId, answers, user, done) {
  adminRole((err, role) => {
    if (err) {
      done('Invalid role.');
      return;
    }
    getUserLocationData((geolocation) => {
      const submission = Submission.create(id, formId, answers, user, geolocation, role);
      submission.save(null).then(
        (s) => {
          done(null, s);
        },
        () => {
          done('Network Error');
        }
      );
    });
  });
}

/**
 * update an existing submission on parse-server
 *
 * @param {object} submission, a Parse.Object instance
 * @param {object} answers, the answers to the current form
 */
function updateParseSubmission(submission, answers, done) {
  if (submission instanceof Parse.Object) {
    submission.save({answers: answers}).then(
      (s) => {
        done(null, s);
      },
      () => {
        done('Network Error');
      }
    );
  } else {
    done('Invalid submission instance type');
  }
}

/**
 * find a submission on parse by uniqueId
 *
 * @param {string} id, the unique id for the record
 */
function findParseSubmission(id, done) {
  const query = new Parse.Query(Submission);
  query.equalTo('uniqueId', id);
  query.find(
    (submissions) => {
      if (submissions && submissions.length) {
        done(null, submissions[0]);
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
 * finds submissions on parse by array of uniqueIds
 *
 * @param {array} uniqueIds, the unique ids for the records
 * @callback {function} done, the callback in node.js format (err, res)
 */
function findParseSubmissions(uniqueIds, done) {
  const query = new Parse.Query(Submission);
  query.containedIn('uniqueId', uniqueIds);
  query.find(
    (submissions) => {
      if (submissions && submissions.length) {
        done(null, submissions);
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
 * upsert a submission to the local realm database
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} formId, the unique id for the parse form record
 * @param {string} userId, the unique id for the currentUser
 * @param {object} answers, the answers to the current form
 * @param {boolean} dirty, mark the submission diry
 */
function upsertRealmSubmission(id, formId, userId, answers, dirty, done) {
  const submissions = realm.objects('Submission').filtered(
    `uniqueId = "${id}"`).sorted('created');
  if (submissions.length > 0) {
    const submission = submissions[0];
    try {
      realm.write(() => {
        submission.dirty = true;
        submission.answers = JSON.stringify(answers);
      });
      completeForm(formId);
      done(null, submission);
    } catch (e) {
      done(`Error updating realm submission ${id}`);
    }
  } else {
    completeForm(formId);
    realm.write(() => {
      try {
        const submission = realm.create('Submission', {
          uniqueId: id,
          formId: formId,
          userId: userId,
          dirty: true,
          created: new Date(),
          answers: JSON.stringify(answers),
        });
        done(null, submission);
      } catch (e) {
        done(`Error saving realm submission ${id}`);
      }
    });
  }
}

/**
 * mark a local realm submission clean
 *
 * @param {string} id, the unique id for the realm record
 */
function markRealmSubmissionClean(id, done) {
  const submissions = realm.objects('Submission').filtered(
    `uniqueId = "${id}"`).sorted('created');
  if (submissions.length > 0) {
    try {
      const submission = submissions[0];
      realm.write(() => {
        submission.dirty = false;
      });
      done(null, submission);
    } catch (e) {
      done(`Error update realm submission ${id}`);
    }
  } else {
    done('Submission does not exist');
  }
}

/**
 * save a submission to realm.io and attempt to propagte to parse-server
 *
 * @param {string} formId, the unique id for the parse form record
 * @param {object} answers, the answers to the current form
 */
export function saveSubmission(formId, answers, done) {
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    id: ['currentUser', (cb, results) => {
      genSubmissionId(formId, results.currentUser, cb);
    }],
    // save to realm and mark dirty
    dirty: ['id', (cb, results) => {
      upsertRealmSubmission(results.id, formId, results.currentUser.id, answers, true, cb);
    }],
    // TODO use cloud code for perform upsert vs. find then save
    // https://gist.github.com/kevinzhang96/1d4680b953e33342f6ab
    find: ['dirty', (cb, results) => {
      findParseSubmission(results.id, cb);
    }],
    // save to parse, if successful mark clean
    save: ['find', (cb, results) => {
      if (results.find === null) {
        createParseSubmission(results.id, formId, answers, results.currentUser, cb);
      } else {
        updateParseSubmission(results.find, answers, cb);
      }
    }],
    // mark the local submission as clean
    clean: ['save', (cb, results) => {
      markRealmSubmissionClean(results.id, cb);
    }],
  }, (err) => {
    if (err) {
      if (err === 'Network Error') {
        return done(null, 'The submission was saved locally.');
      }
      return done(err);
    }
    done(null, 'The submission was saved.');
  });
}

/**
 * loads all cached submissions for the currentUser that are marked dirty
 */
export function loadDirtySubmissions(done) {
  async.auto({
    currentUser: (cb) => {
      currentUser(cb);
    },
    submissions: ['currentUser', (cb, results) => {
      const userId = results.currentUser.id;
      const submissions = realm.objects('Submission').filtered(`userId == "${userId}"`).filtered('dirty == true');
      cb(null, submissions);
    }],
  }, (err, results) => {
    if (err) {
      done(err);
      return;
    }
    done(null, results.submissions);
  });
}

/**
 * attempt to save multiple chached submissions to the remote then mark as
 * clean locally
 *
 * @param {array} submissions, array of realm.io model results
 * @callback {function} done, the callback method in node.js format (err, res)
 */
export function propagateSubmissions(submissions, done) {
  // let work with the realm.io objects in a local scoped array
  const dirty = submissions.slice();
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
      findParseSubmissions(uniqueIds, (err, res) => {
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
            missing.push(Submission.create(d.uniqueId, d.formId, JSON.parse(d.answers), results.currentUser, d.geolocation, results.adminRole));
          });
          // update the existing answers
          res.forEach((e) => {
            const s = dirty.filter((d) => {
              return d.uniqueId === e.get('uniqueId');
            })[0];
            if (typeof s !== 'undefined') {
              e.set('answers', JSON.parse(s.answers));
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
    // Save all the objects in one http request
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
    // mark the local submission as clean
    clean: ['saveAll', (cb) => {
      const numDirty = submissions.length;
      let count = 0;
      realm.write(() => {
        submissions.forEach((submission) => {
          count++;
          if (typeof submission === 'undefined') {
            return;
          }
          submission.dirty = false;
          if (numDirty === count) {
            cb(null, true);
          }
        });
      });
      cb(null, true);
    }],
  }, (err, results) => {
    if (done && typeof done === 'function') {
      if (err) {
        if (err === 'Network Error') {
          return done(null, 'The submission was saved locally.');
        }
        return done(err);
      }
      done(null, results.saveAll);
    }
  });
}
