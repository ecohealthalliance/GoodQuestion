import Joi from '../lib/joi-browser.min';

export default {
  joiCheckError(object, schema) {
    if (typeof this.state.errors === 'undefined') {
      this.state.errors = {};
    }
    const name = Object.keys(object)[0];
    const res = Joi.validate(object, schema);
    const errors = Object.assign({}, this.state.errors);
    let err = null;
    if (res.hasOwnProperty('error')) {
      if (res.error === null) {
        delete errors[name];
        this.setState({errors: errors});
      } else {
        err = res.error.details[0].message;
        errors[name] = err;
        this.setState({errors: errors});
      }
    } else {
      delete errors[name];
      this.setState({errors: errors});
    }
    return err;
  },
  joiValidate(ignore=[]) {
    const errors = {};
    Object.keys(this.schema).forEach((key) => {
      if (ignore.indexOf(key) >= 0) {
        return;
      }
      const value = this.state[key];
      const object = {};
      object[key] = value;
      const schema = {};
      schema[key] = this.schema[key];
      const error = this.joiCheckError(object, schema);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  },
};
