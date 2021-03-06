import React from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';

import Variables from '../styles/Variables';
import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Footer from '../components/Footer';
import Button from '../components/Button';

import { authenticate } from '../api/Account';
import { addUserToInstallation } from '../api/Installations';

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';

const logo = require('../images/logo_stacked.png');

const LoginPage = React.createClass({
  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options({language: {string: {regex: {base: 'must be at least 8 alpha numberic characters'}}}}).label('Password'),
  },

  getInitialState() {
    return {
      email: this.props.email || '',
      password: this.props.password || '',
      buttonText: 'Login',
      errors: [],
    };
  },

  componentDidMount() {
    if (this.props.email && this.props.password) {
      this.handleVerifyLogin();
    }
  },

  /* Methods */
  handleForgotPassword() {
    this.props.navigator.push({path: 'forgotPassword', unsecured: true, title: 'Forgot Password', email: this.state.email});
  },

  handleRegistration() {
    this.props.navigator.push({path: 'registration', unsecured: true, title: 'Registration'});
  },

  handleVerifyLogin() {
    if (this.state.buttonText === 'Verifying...') {
      return;
    }

    // validate
    const errors = this.joiValidate();
    if (errors.length > 0) {
      Alert.alert('Validation', 'The form errors need corrected to continue.');
      return;
    }

    const state = Object.assign({}, this.state);
    state.buttonText = 'Verifying...';
    this.setState(state);

    authenticate(state.email, state.password, (err, user) => {
      if (err) {
        // reset buttonText state
        state.buttonText = 'Login';
        this.setState(state);
        // show a message
        Alert.alert('Error', err);
        return;
      }

      addUserToInstallation(user, (err2) => {
        if (err2) {
          console.warn(err2);
          return;
        }
      });

      this.props.setAuthenticated(true, user);
    });
  },

  /* Render */
  render() {
    return (
      <View style={Styles.container.defaultWhite}>
        <View style={Styles.header.banner}>
          <Image source={logo} style={Styles.header.logo}></Image>
        </View>
        <ScrollView
          ref='scrollView'
          horizontal={false}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode='on-drag'
          style={Styles.form.registrationView}>
          <View style={Styles.form.inputGroup}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.email)}
            </Text>
            <View ref='emailView'>
              <TextInput
                ref='email'
                style={Styles.form.input}
                onChangeText={this.textFieldChangeHandler.bind(null, 'email')}
                onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'emailView', Variables.LOGIN_HEIGHT)}
                onBlur={this.trimText.bind(null, 'email')}
                value={this.state.email}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Email'
              />
            </View>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.password)}
            </Text>
            <View ref='passwordView'>
              <TextInput
                ref='password'
                secureTextEntry={true}
                style={Styles.form.input}
                onChangeText={this.textFieldChangeHandler.bind(null, 'password')}
                onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'passwordView', Variables.LOGIN_HEIGHT)}
                onBlur={this.trimText.bind(null, 'password')}
                value={this.state.password}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Password'
              />
            </View>
          </View>
          <View style={Styles.form.inputGroup}>
            <Button
              action={this.handleVerifyLogin}
              color='success'
              style={{marginVertical: 10, marginHorizontal: 35}}>
              {this.state.buttonText}
            </Button>
          </View>
          <View style={{marginVertical: 10}}>
            <TouchableOpacity onPress={this.handleForgotPassword}>
              <Text style={{color: Color.primary, fontSize: 14, padding: 15, textAlign: 'center'}}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer>
          <Button
            action={this.handleRegistration}
            style={Styles.form.footerButton}
            textStyle={[Styles.form.registerText, Styles.form.registerTextActive]}>
            Register an Account
          </Button>
        </Footer>
      </View>
    );
  },
});

module.exports = LoginPage;
