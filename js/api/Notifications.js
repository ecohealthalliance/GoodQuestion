import realm from '../data/Realm';

// Finds and returns a list of pending Notifications from Realm
export function loadNotifications() {
  return realm.objects('Notification').filtered(
    'complete == false').sorted(
      'datetime', true);
}

// Creates a new notification for an active Time Trigger
export function addTimeTriggerNotification(surveyId, formId, title, description, time) {
  try {
    realm.write(() => {
      realm.create('Notification', {
        surveyId: surveyId,
        formId: formId,
        title: title,
        description: description,
        datetime: time,
      }, true);
    });
  } catch (e) {
    console.error(e);
  }
}
