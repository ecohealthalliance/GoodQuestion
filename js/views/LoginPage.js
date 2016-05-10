
import React, {
  Alert,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Button from '../components/Button'

import {authenticate} from '../api/Account'

import Joi from '../lib/joi-browser.min'
import JoiMixins from '../mixins/joi-mixins'

import async from 'async'
import he from 'he' // HTML entity encode and decode

const LoginPage = React.createClass ({
  title: 'Login to GoodQuestion',
  mixins: [
    JoiMixins,
  ],

  schema: {
    username: Joi.string().min(3).required().label('Username'),
    password: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().label('Password'),
  },

  componentWillMount() {
    this.props.setTitle(this.title);
  },

  getInitialState() {
    return {
      username: '',
      password: '',
      button_text: 'Login',
      errors: [],
    }
  },

  /* Methods */
  handleVerifyLogin() {
    let self = this;

    // validate
    let errors = this.joiValidate();
    if (errors.length > 0) {
      Alert.alert('Validation', 'The form errors need corrected to continue.');
      return;
    }

    let state = Object.assign({}, this.state);
    state.button_text = 'Verifying...';
    this.setState(state);

    authenticate(state.username, state.password, function(err, user) {
      if (err) {
        // reset button_text state
        state.button_text = 'Login';
        self.setState(state);
        // show a message
        Alert.alert(err, 'The username and password combination is invalid.')
        return;
      }
      // the user is authenticated, setAuthenticated to true
      self.props.setAuthenticated(true)
      // allow for the async state to be updated
      async.nextTick(function(){
        // navigate to the default route
        self.props.navigator.replace({});
      });
    });
  },

  decodeText(txt) {
    if (txt) {
      return he.decode(txt);
    }
    return '';
  },

  textFieldChangeHandler(name, text) {
    let schema = {};
    schema[name] = this.schema[name];
    let object = {};
    object[name] = text;
    this.joiCheckError(object, schema);
    let state = Object.assign({}, this.state);
    state[name] = text;
    this.setState(state);
  },

  /* Render */
  render() {
    return (
      <View style={Styles.container.default}>
        <View style={Styles.form.inputGroup}>
          <Text style={Styles.form.errorText}>
            {this.decodeText(this.state.errors.username)}
          </Text>
          <TextInput
            style={Styles.form.input}
            onChangeText={this.textFieldChangeHandler.bind(this, 'username')}
            value={this.state.username}
            placeholder="Username"
          />
        </View>
        <View style={Styles.form.inputGroup}>
          <Text style={Styles.form.errorText}>
            {this.decodeText(this.state.errors.password)}
          </Text>
          <TextInput
            secureTextEntry={true}
            style={Styles.form.input}
            onChangeText={this.textFieldChangeHandler.bind(this, 'password')}
            value={this.state.password}
            placeholder="Password"
          />
        </View>
        <View style={Styles.form.bottomForm}>
          <Button action={this.handleVerifyLogin} color='primary' wide>
            {this.state.button_text}
          </Button>
        </View>
      </View>
    )
  }
})

module.exports = LoginPage
