import React from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';

import Variables from '../styles/Variables';
import Styles from '../styles/Styles';
import Button from '../components/Button';

import Checkbox from '../components/Checkbox';
import Footer from '../components/Footer';

import Icon from 'react-native-vector-icons/FontAwesome';

const uncheckedComponent = <Icon name='square-o' size={30} />;
const checkedComponent = <Icon name='check-square-o' size={30} />;

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';

const RegistrationPagePart1 = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  styles: {
    checkboxWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 50,
      height: 35,
    },
  },

  formInputs: [
    'email',
    'password',
    'confirmPassword',
    'acceptedTerms',
  ],
  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    email: Joi.string().email({minDomainAtoms: 2}).required().options(
      {language: {any: {allowOnly: 'must be a valid email'}}}).label('Email'),
    password: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('Password'),
    confirmPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('Confirm Password'),
    acceptedTerms: Joi.boolean().required().invalid(false).options(
      {language: {any: {invalid: 'must be accepted'}}}).label('Terms of Service'),
  },

  getInitialState() {
    return {
      title: 'Registration',
      buttonText: 'Next',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
      errors: {},
    };
  },

  /* Methods */
  goToTermsPage() {
    this.props.navigator.push({path: 'terms', unsecured: true, title: 'Terms of Service'});
  },

  goToNextPage() {
    const errors = this.props.validatePage(0);
    if (Object.keys(errors).length <= 0) {
      this.props.setIndex(1);
      return;
    }
  },

  confirmPasswordChangeHandler(name, value) {
    const password = this.state.password;
    const errors = Object.assign({}, this.state.errors);
    const state = {
      errors: errors,
    };
    if (password !== value) {
      state.errors[name] = '"Confirm Password" does not match password';
      state[name] = value;
      this.setState(state);
      return;
    }
    // continue with mixin handler
    this.textFieldChangeHandler(name, value);
  },

  renderTerms() {
    return (
      <Text style={[Styles.type.h3, {textAlign: 'center', paddingBottom: 2, position: 'relative'}]}>
        <Text>I accept the </Text>
        <Text style={Styles.type.link} onPress={this.goToTermsPage}>Terms of Service.</Text>
      </Text>
    );
  },

  /* Render */
  render() {
    this.props.buttonStyles(this, this.formInputs);
    return (
      <View style={[Styles.container.defaultWhite]}>
        <ScrollView
          ref='scrollView'
          horizontal={false}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode='on-drag'
          style={Styles.form.registrationView}>
          <View style={{paddingBottom: 50}}>
            <Text style={[Styles.type.h1, {textAlign: 'center'}]} >
              Create an Account
            </Text>
            <View style={Styles.form.inputGroup}>
              <Text style={Styles.form.errorText}>
                {this.decodeText(this.state.errors.email)}
              </Text>
              <View ref='emailView'>
                <TextInput
                  ref='email'
                  style={Styles.form.input}
                  onChangeText={this.textFieldChangeHandler.bind(null, 'email')}
                  onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'emailView', Variables.REGISTRATION_HEIGHT)}
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
                  onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'passwordView', Variables.REGISTRATION_HEIGHT)}
                  onBlur={this.trimText.bind(null, 'password')}
                  value={this.state.password}
                  autoCapitalize='none'
                  autoCorrect={false}
                  returnKeyType='done'
                  placeholder='Password'
                />
              </View>
              <Text style={Styles.form.errorText}>
                {this.decodeText(this.state.errors.confirmPassword)}
              </Text>
              <View ref='confirmPasswordView'>
                <TextInput
                  ref='confirmPassword'
                  secureTextEntry={true}
                  style={Styles.form.input}
                  onChangeText={this.confirmPasswordChangeHandler.bind(null, 'confirmPassword')}
                  onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'confirmPasswordView', Variables.REGISTRATION_HEIGHT)}
                  onBlur={this.trimText.bind(null, 'confirmPassword')}
                  value={this.state.confirmPassword}
                  autoCapitalize='none'
                  autoCorrect={false}
                  returnKeyType='done'
                  placeholder='Confirm Password'
                />
              </View>
              <Text style={Styles.form.errorText}>
                {this.decodeText(this.state.errors.acceptedTerms)}
              </Text>
              <View style={this.styles.checkboxWrapper}>
                <Checkbox
                  children={this.renderTerms()}
                  checked={this.state.acceptedTerms}
                  uncheckedComponent={uncheckedComponent}
                  checkedComponent={checkedComponent}
                  onChange={this.checkboxChangeHandler.bind(null, 'acceptedTerms')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <Footer>
          <Button action={this.goToNextPage} style={this.buttonStyles} textStyle={this.buttonTextStyles}>
            {this.state.buttonText}
          </Button>
        </Footer>
      </View>
    );
  },
});

module.exports = RegistrationPagePart1;
