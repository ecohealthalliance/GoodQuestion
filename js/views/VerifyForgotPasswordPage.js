import React from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';

import Styles from '../styles/Styles';
import Variables from '../styles/Variables';

import { verifyForgotPassword } from '../api/Account';

import Button from '../components/Button';

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';

const logo = require('../images/logo_stacked.png');

const VerifyForgotPasswordPage = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    code: Joi.string().required().label('Code'),
    email: Joi.string().email().required().label('Email'),
    newPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('New Password'),
    confirmNewPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('Confirm New Password'),
  },

  getInitialState() {
    return {
      isLoading: true,
      buttonText: 'Submit',
      code: this.props.code || null,
      email: this.props.email || null,
      newPassword: null,
      confirmNewPassword: null,
      errors: [],
    };
  },

  confirmNewPasswordHandler(name, value) {
    const password = this.state.newPassword;
    const errors = Object.assign({}, this.state.errors);
    const state = {
      errors: errors,
    };
    if (password !== value) {
      state.errors[name] = '"Confirm New Password" does not match new password';
      state[name] = value;
      this.setState(state);
      return;
    }
    // continue with mixin handler
    this.textFieldChangeHandler(name, value);
  },

  submit() {
    const errors = this.joiValidate();
    if (Object.keys(errors).length > 0) {
      Alert.alert('Error', 'Fix the form errors before submission.');
      this.setState({errors: errors});
      return;
    }
    this.setState({buttonText: 'Updating...'});
    const params = {
      code: this.state.code,
      email: this.state.email,
      newPassword: this.state.newPassword,
    };
    verifyForgotPassword(params, (err) => {
      this.setState({buttonText: 'Submit'}, () => {
        if (err) {
          if (err.hasOwnProperty('message')) {
            Alert.alert('Error', err.message);
            return;
          }
          Alert.alert('Error', err);
          return;
        }
        Alert.alert('Success', 'Your password has been reset.');
        this.props.navigator.resetTo({path: 'login', title: 'Login'});
      });
    });
  },

  /* Render */
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={[Styles.header.banner, {
          height: Variables.FORGOT_PASSWORD_HEIGHT,
          paddingBottom: Platform.OS === 'android' ? 5 : 25,
        }]}>
          <Image source={logo} style={Styles.header.logo}></Image>
        </View>
        <ScrollView
          ref='scrollView'
          horizontal={false}>
          <View style={{marginTop: 15}}>
            <Text style={{fontSize: 18, padding: 15, textAlign: 'center'}}>
              Fill out the form with your code, email, and password.
            </Text>
          </View>
          <View style={Styles.form.inputGroup}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.code)}
            </Text>
            <View ref='codeView'>
              <TextInput
                ref='code'
                style={Styles.form.input}
                onChangeText={this.textFieldChangeHandler.bind(null, 'code')}
                onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'codeView', Variables.FORGOT_PASSWORD_HEIGHT)}
                onBlur={this.trimText.bind(null, 'code')}
                value={this.state.code}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Code'
              />
            </View>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.email)}
            </Text>
            <View ref='emailView'>
              <TextInput
                ref='email'
                style={Styles.form.input}
                onChangeText={this.textFieldChangeHandler.bind(null, 'email')}
                onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'emailView', Variables.FORGOT_PASSWORD_HEIGHT)}
                onBlur={this.trimText.bind(null, 'email')}
                value={this.state.email}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Email'
              />
            </View>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.newPassword)}
            </Text>
            <View ref='newPasswordView'>
              <TextInput
                ref='newPassword'
                style={Styles.form.input}
                secureTextEntry={true}
                onChangeText={this.textFieldChangeHandler.bind(this, 'newPassword')}
                onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'newPasswordView')}
                onBlur={this.trimText.bind(this, 'newPassword')}
                value={this.state.newPassword}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='New Password'
              />
            </View>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.confirmNewPassword)}
            </Text>
            <View ref='confirmNewPasswordView'>
              <TextInput
                ref='confirmNewPassword'
                style={Styles.form.input}
                secureTextEntry={true}
                onChangeText={this.confirmNewPasswordHandler.bind(this, 'confirmNewPassword')}
                onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'confirmNewPasswordView')}
                onBlur={this.trimText.bind(this, 'confirmNewPassword')}
                value={this.state.confirmNewPassword}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Confirm New Password'
              />
            </View>
          </View>
          <View style={Styles.form.inputGroup}>
            <Button
              action={this.submit}
              color='success'
              style={{marginVertical: 10, marginHorizontal: 35}}>
              {this.state.buttonText}
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  },
});

module.exports = VerifyForgotPasswordPage;
