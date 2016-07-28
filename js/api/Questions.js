import Parse from 'parse/react-native';
import realm from '../data/Realm';


// Saves a Question object from Parse into our Realm.io local database
export function cacheParseQuestions(questions, formId) {
  try {
    const questionsLength = questions.length;
    realm.write(() => {
      for (let i = 0; i < questionsLength; i++) {
        realm.create('Question', {
          id: questions[i].id,
          formId: formId,
          order: questions[i].get('order'),
          text: questions[i].get('text'),
          type: questions[i].get('type'),
          required: questions[i].get('required') ? true : false, // eslint-disable-line
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
          cacheParseQuestions(results, form.id);
          if (callback) {
            callback(null, results);
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
