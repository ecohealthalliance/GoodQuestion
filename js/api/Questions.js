import Parse from 'parse/react-native';
import realm from '../data/Realm';


// Saves a Question object from Parse into our Realm.io local database
export function cacheParseQuestions(questions, formId) {
  try {
    realm.write(() => {
      for (let i = 0; i < questions.length; i++) {
        realm.create('Question', {
          id: questions[i].id,
          formId: formId,
          order: questions[i].get('order'),
          text: questions[i].get('text'),
          type: questions[i].get('type'),
          required: questions[i].get('required') || false,
          properties: JSON.stringify(questions[i].get('properties')),
        }, true);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

// Loads a question list from the Realm.io database
export function loadCachedQuestions(formId) {
  return realm.objects('Question').filtered(
    `formId = "${formId}"`).sorted('order');
}

/**
 *
 * loads questions from the cache from an array of forms
 *
 * @param {array} forms, an array of forms
 */
export function loadCachedQuestionsFromForms(forms) {
  return realm.objects('Question').filtered(forms.map((form) => `formId == "${form.id}"`).join(' OR ')).sorted('order');
}

// Queries the connected Parse server for a list of Questions.
export function loadQuestions(cachedForm, callback) {
  const Form = Parse.Object.extend('Form');
  const query = new Parse.Query(Form);
  query.get(cachedForm.id,
    (form) => {
      const formQuestionRelations = form.get('questions');
      formQuestionRelations.query().find(
        (results) => {
          // decided to filter the results client-side a) the number of
          // question relations is realtively small b) the schema may or
          // may not have the key 'deleted'
          const filtered = results.filter((result) => {
            if (typeof result.get('deleted') === 'undefined') {
              return result;
            }
            if (result.get('deleted') === false) {
              return result;
            }
          });
          cacheParseQuestions(filtered, form.id);
          if (callback) {
            callback(null, filtered);
          }
        },
        (error, results) => {
          console.warn(`Error: ${error.code} ${error.message}`);
          if (callback) {
            callback(error, results);
          }
        }
      );
    },
    (error, results) => {
      console.warn(`Error: ${error.code} ${error.message}`);
      if (callback) {
        callback(error, results);
      }
    }
  );
}
