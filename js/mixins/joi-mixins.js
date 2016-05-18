import Joi from '../lib/joi-browser.min'

export default {
  joiCheckError: function(object, schema) {
    if (typeof this.state.errors === 'undefined') {
      this.state.errors = {};
    }
    const name = Object.keys(object)[0];
    const res = Joi.validate(object, schema);
    const errors = Object.assign({}, this.state.errors)
    let err = null;
    if (res.hasOwnProperty('error')) {
      if (res.error != null) {
        errors[name] = res.error.details[0].message;
        this.setState({errors: errors});
        err = res.error.details[0];
      } else {
        errors[name] = '';
        this.setState({errors: errors});
      }
    } else {
      errors[name] = '';
      this.setState({errors: errors});
    }
    return err;
  },
  joiValidate: function() {
    const self = this;
    const errors = [];
    Object.keys(this.schema).forEach(function(key) {
      var value = self.state[key];
      var object = {};
      object[key] = value;
      var schema = {};
      schema[key] = self.schema[key];
      var error = self.joiCheckError(object, schema);
      if (error) {
        errors.push(error);
      }
    });
    return errors;
  },
};
