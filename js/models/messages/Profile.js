import Joi from '../../lib/joi-browser.min';
import ValidObject from '../ValidObject';

/**
 * validation schema for ToastMessage class
 */
const schema = {
  avatar: Joi.object().required(),
};

/**
 * pubsub addresses for Toaster.js
 */
export const ProfileChannels = {
  CHANGE: 'profile:change',
};

export class ProfileMessage extends ValidObject {
  /**
   * constructs a new ProfileMessage
   *
   * @param {object} state, the new state for the component
   */
  constructor(avatar) {
    super();
    this.avatar = avatar;
    this._schema = schema;
  }

  /**
   * factory static method that trys to construct a valid instance of ProfileMessage
   * to send via pubsub
   *
   * @param {object} object, JavaScript object containing values for the constructor
   * @return {object} profileMessage, an instanceof ProfileMessage or null
   */
  static createFromObject(object) {
    let profileMessage = null;
    if (typeof object !== 'object') {
      return profileMessage;
    }
    try {
      profileMessage = new ProfileMessage(object);
    } catch (e) {
      console.warn(`Could not construct ProfileMessage object from ${object}`);
      return profileMessage;
    }

    const valid = profileMessage.isValid();
    if (!valid) {
      const errors = profileMessage.validate();
      console.warn(`Invalid request: ${errors}`);
      return profileMessage;
    }

    // return the constructed profileMessage if no errors occured
    return profileMessage;
  }
}
