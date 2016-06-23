import Joi from '../lib/joi-browser.min'
import ValidObject from './ValidObject'

/**
 * validation schema for ToastMessage class
 */
const schema = {
  title: Joi.string().required(),
  message: Joi.string().required(),
  icon: Joi.string().required(),
  iconColor: Joi.string().required(),
  duration: Joi.number().integer(),
};

/**
 * pubsub addresses for Toaster.js
 */
export const ToastAddresses = {
  SHOW: 'toast:show'
};

export class ToastMessage extends ValidObject {
  /**
   * constructs a new ToastMessage
   *
   * @param {string} title, the title of the toast
   * @param {string} message, the message of the toast
   * @param {string} icon, the FontAwesome icon name
   * @param {string} iconColor, the FontAwesome icon color
   * @param {integer} duration, the duration of the toast in minutes @default 6
   */
  constructor(title, message, icon, iconColor, duration) {
    super();
    this.title = title;
    this.message = message;
    this.icon = icon;
    this.iconColor = iconColor;
    if (typeof duration === 'undefined') {
      duration = 6;
    }
    this.duration = duration;
    this._schema = schema;
  }

  /**
   * factory static method that trys to construct a valid instance of ToastMessage
   * to send via pubsub
   *
   * @param {object} object, JavaScript object containing values for the constructor
   * @return {object} toastMessage, an instanceof ToastMessage or null
   */
  static createFromObject(object) {
    let toastMessage = null;
    if (typeof object !== 'object') return toastMessage;

    const errors = []
    try {
      toastMessage = new ToastMessage(object.title, object.message, object.icon, object.iconColor, object.duration);
    } catch(e) {
      console.warn('Could not construct ToastMessage object from ', object);
      return toastMessage;
    }

    const valid = toastMessage.isValid();
    if (!valid) {
      const errors = toastMessage.validate();
      console.warn('Invalid request: ', errors)
      return toastMessage;
    }

    // return the constructed toastMessage if no errors occured
    return toastMessage;
  }
}