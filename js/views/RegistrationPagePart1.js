
import React, {
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native'

import Variables from '../styles/Variables'
import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Button from '../components/Button'

import Checkbox from 'react-native-checkbox'
import Icon from 'react-native-vector-icons/FontAwesome'

const uncheckedComponent = (<Icon name='square-o' size={30} />);
const checkedComponent = (<Icon name='check-square-o' size={30} />);

import Joi from '../lib/joi-browser.min'
import JoiMixins from '../mixins/joi-mixins'
import EventMixins from '../mixins/event-mixins'
import he from 'he' // HTML entity encode and decode

const RegistrationPagePart1 = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  styles: {
    registrationHeader: {
      flex: 1,
      height: Variables.REGISTRATION_HEIGHT,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: Color.background1,
      paddingBottom: 25,
      marginBottom: 5,
    },
    checkboxWrapper: {
      alignItems:'center',
      justifyContent:'center',
      marginLeft: 50,
      height: 35,
    },
    logo: {
      width: 240,
      resizeMode: 'contain',
    },
  },

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    email: Joi.string().email({minDomainAtoms: 2}).required().options({language: {any: {allowOnly: 'must be a valid email'}}}).label('Email'),
    password: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options({language: {string: {regex: {base: 'must be at least 8 alpha numberic characters'}}}}).label('Password'),
    confirmPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options({language: {string: {regex: {base: 'must be at least 8 alpha numberic characters'}}}}).label('Confirm Password'),
    acceptedTerms: Joi.boolean().required().invalid(false).options({language: {any: {invalid: 'must be accepted'}}}).label('Terms of Service'),
  },

  getInitialState() {
    return {
      button_text: 'Next',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
      errors: {},
    }
  },

  componentWillMount() {
  },

  /* Methods */
  goToTermsPage() {
    this.props.navigator.push({path: 'terms', unsecured: true})
  },

  goToNextPage() {
    const shouldContinue = this.props.validatePage(0);
    if (shouldContinue) {
      this.props.setIndex(1);
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
      state[name] = value
      this.setState(state);
      return;
    }
    // continue with mixin handler
    this.textFieldChangeHandler(name, value);
  },

  decodeText(txt) {
    if (txt) {
      return he.decode(txt);
    }
    return '';
  },

  renderTerms() {
    return (
      <Text style={[Styles.type.h3, {textAlign: 'center', paddingBottom: 2}]}>
        <Text>I accept the </Text>
        <TouchableWithoutFeedback onPress={this.goToTermsPage}>
          <Text style={Styles.type.link}>Terms of Service.</Text>
        </TouchableWithoutFeedback>
      </Text>
    );
    this.props.navigator.push({path: 'terms', title: 'Terms of Service'})
  },

  /* Render */
  render() {
    return (
      <View>
        <View style={this.styles.registrationHeader}>
          <Image source={require('../images/logo_stacked.png')} style={this.styles.logo}></Image>
        </View>
        <ScrollView style={{height: this.props.calculateScrollViewHeight()}}>
          <Text style={[Styles.type.h1, {textAlign: 'center'}]} >
            Create an Account
          </Text>
          <View style={Styles.form.inputGroup}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.email)}
            </Text>
            <TextInput
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'email')}
              value={this.state.email}
              autoCapitalize='none'
              autoCorrect={false}
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
              placeholder='Password'
            />
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.confirmPassword)}
            </Text>
            <TextInput
              secureTextEntry={true}
              style={Styles.form.input}
              onChangeText={this.confirmPasswordChangeHandler.bind(this, 'confirmPassword')}
              value={this.state.confirmPassword}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='Confirm Password'
            />
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.acceptedTerms)}
            </Text>
            <View style={this.styles.checkboxWrapper}>
              <Checkbox
                children={this.renderTerms()}
                checked={this.state.acceptedTerms}
                uncheckedComponent={uncheckedComponent}
                checkedComponent={checkedComponent}
                onChange={this.checkboxChangeHandler.bind(this, 'acceptedTerms')}
              />
            </View>
          </View>
          <View style={Styles.form.bottomForm}>
            <Button action={this.goToNextPage} color='primary' wide>
              {this.state.button_text}
            </Button>
          </View>
        </ScrollView>
      </View>
    )
  }
})

module.exports = RegistrationPagePart1
