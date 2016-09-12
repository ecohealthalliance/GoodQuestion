import Joi from '../../lib/joi-browser.min';
import ValidObject from '../ValidObject';

/**
 * validation schema for NotificationMessage class
 */
const schema = {
  id: Joi.string().required(),
  surveyId: Joi.string().allow('').required(),
  formId: Joi.string().allow('').required(),
  triggerId: Joi.string().allow('').required(),
  userId: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  createdAt: Joi.date().required(),
};

/**
 * pubsub channels for Notification.js
 */
export const NotificationChannels = {
  CREATE: 'notification:create',
};

export class NotificationMessage extends ValidObject {
  /**
   * constructs a new NotificationMessage
   *
   * @param {object} obj, the object with the following properties
   * @param {string} obj.id, the id of the notification object
   * @param {string} obj.surveyId, the id of the survey
   * @param {string} obj.formId, the id of the form
   * @param {string} obj.triggerId, the id of the trigger
   * @param {string} obj.userId, the id of the user
   * @param {string} obj.title, the title of the notification
   * @param {string} obj.message, the message of the notification
   * @param {date} obj.createdAt, the time that the notification was created
   */
  constructor(obj) {
    super();
    this.id = obj.id;
    this.surveyId = obj.surveyId;
    this.formId = obj.formId;
    this.triggerId = obj.triggerId;
    this.userId = obj.userId;
    this.title = obj.title;
    this.message = obj.message;
    this.createdAt = obj.createdAt;
    this._schema = schema;
  }

  /**
   * factory static method that trys to construct a valid instance of NotificationMessage
   * to send via pubsub
   *
   * @param {object} obj, JavaScript object containing values for the constructor
   * @return {object} notificationMessage, an instanceof NotificationMessage or null
   */
  static createFromObject(obj) {
    let notificationMessage = null;
    if (typeof obj !== 'object') {
      return notificationMessage;
    }
    try {
      notificationMessage = new NotificationMessage(obj);
    } catch (e) {
      console.warn(`Could not construct NotificationMessage object from ${obj}`);
      return notificationMessage;
    }

    const valid = notificationMessage.isValid();
    if (!valid) {
      const errors = notificationMessage.validate();
      console.warn(`Invalid request: ${errors}`);
      return notificationMessage;
    }

    // return the constructed notificationMessage if no errors occured
    return notificationMessage;
  }
}
