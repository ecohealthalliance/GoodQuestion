import Joi from '../lib/joi-browser.min';

/**
 * ValidObject is a base class to be extended for validation purposes. It was
 * created for use with non-realm models, but potentailly this could be
 * implemented in the future to validate data comming in from the remote
 * server.
 */
class ValidObject {
  /**
   * validates the object based on a schema
   *
   * @return {array} errors, an array of errors
   */
  validate() {
    if (typeof this._schema === 'undefined') {
      return ['Invalid Schema'];
    }
    const errors = [];
    Object.keys(this._schema).forEach((key) => {
      const value = this[key];
      const obj = {};
      obj[key] = value;
      const singleSchema = {};
      singleSchema[key] = this._schema[key];
      const res = Joi.validate(obj, singleSchema);
      if (res.hasOwnProperty('error') && res.error !== null) {
        errors.push(res.error);
      }
    });
    return errors;
  }
  /**
   * determines if the object has any property errors by calling validate
   *
   * @return {boolean} valid
   */
  isValid() {
    const errors = this.validate();
    if (errors.length > 0) {
      return false;
    }
    return true;
  }
}

module.exports = ValidObject;
