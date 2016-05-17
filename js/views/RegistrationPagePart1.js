
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
  ],

  schema: {
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().label('Password'),
    confirmPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().label('Confirm Password'),
    terms: Joi.boolean().required().invalid(false).label('Terms of Service'),
  },

  getInitialState() {
    return {
      button_text: 'Next',
      email: '',
      password: '',
      confirmPassword: '',
      terms: true,
      errors: [],
    }
  },

  componentWillMount() {
  },

  /* Methods */
  goToTermsPage() {
    this.props.navigator.push({name: 'terms', unsecured: true})
  },

  goToNextPage() {
    const shouldContinue = this.props.validatePage(0);
    if (shouldContinue) {
      this.props.setIndex(1);
    }
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

  renderTerms() {
    return (
      <Text style={[Styles.type.h3, {textAlign: 'center', paddingBottom: 2}]}>
        <Text>I accept the </Text>
        <TouchableWithoutFeedback onPress={this.goToTermsPage}>
          <Text style={Styles.type.link}>Terms of Service.</Text>
        </TouchableWithoutFeedback>
      </Text>
    );
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
              onChangeText={this.textFieldChangeHandler.bind(this, 'confirmPassword')}
              value={this.state.confirmPassword}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='Confirm Password'
            />
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.terms)}
            </Text>
            <View style={this.styles.checkboxWrapper}>
              <Checkbox
                children={this.renderTerms()}
                checked={this.state.terms}
                uncheckedComponent={uncheckedComponent}
                checkedComponent={checkedComponent}
                onChange={(checked)=>{
                  this.setState({terms: checked});
                }}
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
