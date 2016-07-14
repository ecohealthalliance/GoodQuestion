import Parse from 'parse/react-native';
import realm from '../data/Realm';
import {currentUser} from '../api/Account';
import crypto from 'crypto-js';
import async from 'async';

const Submission = Parse.Object.extend('Submission');

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
 * create a submission on parse-server
 * TODO set ACL in cloud code afterSave
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} formId, the unique id for the parse form record
 * @param {object} answers, the answers to the current form
 * @param {object} currentUser, the current parse user saved to AsyncStorage
 */
function createParseSubmission(id, formId, answers, user, done) {
  const submission = new Submission();
  submission.set('uniqueId', id);
  submission.set('formId', formId);
  submission.set('answers', answers);
  submission.set('userId', user);
  const query = new Parse.Query(Parse.Role);
  query.equalTo('name', 'admin');
  query.find(
    (roles) => {
      if (roles.length <= 0) {
        return done('Invalid role.');
      }
      const role = roles[0];
      const acl = new Parse.ACL();
      acl.setReadAccess(user, true);
      acl.setWriteAccess(user, true);
      acl.setRoleReadAccess(role, true);
      acl.setRoleWriteAccess(role, true);
      submission.setACL(acl);
      submission.save(null).then(
        (s) => {
          done(null, s);
        },
        () => {
          done('Error synchronizing to remote server.');
        }
      );
    },
    () => {
      done('Invalid role.');
    }
  );
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
        done('Error synchronizing to remote server.');
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
    (submission) => {
      if (submission.length) {
        done(null, submission[0]);
        return;
      }
      done(null, null);
    },
    () => {
      done('No results');
    }
  );
}

/**
 * upsert a submission to the local realm database
 *
 * @param {string} id, the unique id for the realm record
 * @param {string} formId, the unique id for the parse form record
 * @param {object} answers, the answers to the current form
 * @param {boolean} dirty, mark the submission diry
 */
function upsertRealmSubmission(id, formId, answers, dirty, done) {
  const submissions = realm.objects('Submission').filtered(
    `uniqueId = "${id}"`).sorted('created');
  const notification = realm.objects('Notification').filtered(`formId = "${formId}"`);
  const timeTrigger = realm.objects('TimeTrigger').filtered(`formId = "${formId}"`);
  if (submissions.length > 0) {
    const submission = submissions[0];
    try {
      realm.write(() => {
        submission.dirty = true;
        submission.answers = JSON.stringify(answers);
      });
      done(null, submission);
    } catch (e) {
      done(`Error updating realm submission ${id}`);
    }
  } else {
    realm.write(() => {
      try {
        const submission = realm.create('Submission', {
          uniqueId: id,
          formId: formId,
          dirty: true,
          created: new Date(),
          answers: JSON.stringify(answers),
        });
        if (notification) {
          notification.complete = true;
        }
        if (timeTrigger) {
          timeTrigger.complete = true;
        }
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
      upsertRealmSubmission(results.id, formId, answers, true, cb);
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
      done(err);
      return;
    }
    done(null, 'The submission was saved.');
  });
}
