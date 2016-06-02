
import React, {
  Alert,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Button from '../components/Button'

import {authenticate} from '../api/Account'

import Joi from '../lib/joi-browser.min'
import JoiMixins from '../mixins/joi-mixins'
import he from 'he' // HTML entity encode and decode

import async from 'async'

const LoginPage = React.createClass ({
  title: ' ',

  styles: {
    loginFooter: {
      flex: 1,
      height: 75,
      backgroundColor: '#F0F0F0',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    registerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4E546A',
    },
  },

  mixins: [
    JoiMixins,
  ],

  schema: {
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options({language: {string: {regex: {base: 'must be at least 8 alpha numberic characters'}}}}).label('Password'),
  },

  getInitialState() {
    return {
      email: '',
      password: '',
      button_text: 'Login',
      errors: [],
    }
  },

  /* Methods */
  handleRegistration() {
    this.props.navigator.push({path:'registration', unsecured: true, title: 'Registration'})
  },

  handleVerifyLogin() {
    let self = this;

    if (self.state.button_text === 'Verifying...') {
      return;
    }

    // validate
    let errors = this.joiValidate();
    if (errors.length > 0) {
      Alert.alert('Validation', 'The form errors need corrected to continue.');
      return;
    }

    let state = Object.assign({}, this.state);
    state.button_text = 'Verifying...';
    this.setState(state);

    authenticate(state.email, state.password, function(err, user) {
      if (err) {
        // reset button_text state
        state.button_text = 'Login';
        self.setState(state);
        // show a message
        Alert.alert(err, 'The email and password combination is invalid.')
        return;
      }
      self.props.setAuthenticated(true);
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
      <View style={[Styles.container.defaultWhite]}>
        <View>
          <View style={Styles.header.banner}>
            <Image source={require('../images/logo_stacked.png')} style={Styles.header.logo}></Image>
          </View>
          <View style={{paddingVertical: 45, paddingHorizontal: 15}}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.email)}
            </Text>
            <TextInput
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'email')}
              value={this.state.email}
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              keyboardType='email-address'
              placeholder='Email'
            />
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.password)}
            </Text>
            <TextInput
              secureTextEntry={true}
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'password')}
              value={this.state.password}
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              placeholder='Password'
            />
            <Button action={this.handleVerifyLogin} color='success' style={{marginVertical: 30, marginHorizontal: 20}}>
              {this.state.button_text}
            </Button>
          </View>

          <View style={Styles.form.bottomForm}>
            
          </View>
        </View>

        <TouchableWithoutFeedback onPress={this.handleRegistration}>
          <View style={this.styles.loginFooter}>
              <Text style={this.styles.registerText}> Register an Account </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
})

module.exports = LoginPage
