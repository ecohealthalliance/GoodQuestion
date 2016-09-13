import React from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Variables from '../styles/Variables';

import { forgotPassword } from '../api/Account';

import Button from '../components/Button';

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';

const logo = require('../images/logo_stacked.png');

const ForgotPasswordPage = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    email: Joi.string().email().required().label('Email'),
  },

  getInitialState() {
    return {
      isLoading: true,
      buttonText: 'Submit',
      email: this.props.email || null,
      errors: [],
    };
  },

  handleCode() {
    this.props.navigator.replace({
      path: 'verifyForgotPassword',
      unsecured: true,
      title: 'Verfify Forgot Password',
      email: this.state.email,
    });
  },

  submit() {
    const errors = this.joiValidate();
    if (Object.keys(errors).length > 0) {
      Alert.alert('Error', 'Fix the form errors before submission.');
      this.setState({errors: errors});
      return;
    }
    this.setState({buttonText: 'Updating...'});
    forgotPassword({email: this.state.email}, (err) => {
      this.setState({buttonText: 'Submit'}, () => {
        if (err) {
          if (err.hasOwnProperty('message')) {
            Alert.alert('Error', err.message);
            return;
          }
          Alert.alert('Error', err);
          return;
        }
        Alert.alert('Success', 'Check your email for the password reset code.');
        this.props.navigator.resetTo({
          path: 'login',
          title: 'Login',
        });
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
              Enter your email address to reset your password.
            </Text>
          </View>
          <View style={Styles.form.inputGroup}>
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
          </View>
          <View style={Styles.form.inputGroup}>
            <Button
              action={this.submit}
              color='success'
              style={{marginVertical: 10, marginHorizontal: 35}}>
              {this.state.buttonText}
            </Button>
          </View>
          <View style={{marginVertical: 20}}>
            <TouchableOpacity onPress={this.handleCode}>
              <Text style={{color: Color.primary, fontSize: 14, padding: 15, textAlign: 'center'}}>Already have a code?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  },
});

module.exports = ForgotPasswordPage;
