
import React, {
  Alert,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native'

import Variables from '../styles/Variables'
import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Button from '../components/Button'

import { authenticate } from '../api/Account'
import { addUserToInstallation } from '../api/Installations'


import Joi from '../lib/joi-browser.min'
import JoiMixins from '../mixins/joi-mixins'
import he from 'he' // HTML entity encode and decode

import EventMixins from '../mixins/event-mixins'

import async from 'async'

const {height, width} = Dimensions.get('window')

const LoginPage = React.createClass ({
  title: ' ',

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

      addUserToInstallation(user, (err) => {
        if (err) {
          console.warn(err);
          return;
        }
      });

      self.props.setAuthenticated(true);
    });
  },

  /**
   * dynamically calculate scroll view height
   *
   * @return {number} ideal height of the ScrollView
   */
  calculateScrollViewHeight() {
    return height - this.calculateOffset();
  },
  calculateOffset() {
    return Variables.HEADER_SIZE + Variables.LOGIN_HEIGHT + 80;
  },

  /* Render */
  render() {
    return (
      <View style={[Styles.container.defaultWhite]}>
          <View style={Styles.header.banner}>
            <Image source={require('../images/logo_stacked.png')} style={Styles.header.logo}></Image>
          </View>
          <ScrollView
            ref='scrollView'
            horizontal={false}
            style={[Styles.form.registrationView, {height: this.calculateScrollViewHeight(), overflow: 'hidden'}]}>
            <View style={{paddingVertical: 30, paddingHorizontal: 15}}>
              <Text style={Styles.form.errorText}>
                {this.decodeText(this.state.errors.email)}
              </Text>
              <View ref='emailView'>
                <TextInput
                  style={Styles.form.input}
                  onChangeText={this.textFieldChangeHandler.bind(this, 'email')}
                  onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'emailView', this.calculateOffset())}
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
                  secureTextEntry={true}
                  style={Styles.form.input}
                  onChangeText={this.textFieldChangeHandler.bind(this, 'password')}
                  onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'passwordView', Variables.HEADER_SIZE + Variables.LOGIN_HEIGHT + 80)}
                  value={this.state.password}
                  autoCapitalize='none'
                  autoCorrect={false}
                  returnKeyType='done'
                  placeholder='Password'
                />
              </View>
            </View>
            <Button
              action={this.handleVerifyLogin}
              color='success'
              style={{marginVertical: 30, marginHorizontal: 35}}>
              {this.state.button_text}
            </Button>
          </ScrollView>
        <Button
          action={this.handleRegistration}
          style={Styles.form.footerButton}
          textStyle={[Styles.form.registerText, Styles.form.registerTextActive]}>
          Register an Account
        </Button>
      </View>
    )
  }
})

module.exports = LoginPage
