import Joi from '../lib/joi-browser.min'

var JoiMixins = {
  joiCheckError: function(object, schema) {
    var self = this;
    var state = Object.assign({}, self.state);
    if (typeof state.errors === 'undefined') {
      state.errors = {};
    }
    var name = Object.keys(object)[0];
    var res = Joi.validate(object, schema);
    var err = null;
    if (res.hasOwnProperty('error')) {
      if (res.error != null) {
        state.errors[name] = res.error.details[0].message;
        self.setState(state);
        err = res.error.details[0];
      } else {
        state.errors[name] = '';
        self.setState(state);
      }
    } else {
      state.errors[name] = '';
      self.setState(state);
    }
    return err;
  },
  joiValidate: function() {
    var self = this;
    var errors = [];
    Object.keys(self.schema).forEach(function(key) {
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
module.exports = JoiMixins;
