
import React, {
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
} from 'react-native'

import Button from '../components/Button'
import Styles from '../styles/Styles'
import Color from '../styles/Color'

import Joi from '../lib/joi-browser.min'
import JoiMixins from '../mixins/joi-mixins'
import he from 'he' // HTML entity encode and decode

const RegistrationPagePart3 = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  styles: {
    registrationHeader: {
      flex: 1,
      height: 125,
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
    fullName: Joi.string().min(3).required().label('Full Name'),
    phoneNumber: Joi.string().optional().label('Phone Number'),
  },

  getInitialState() {
    return {
      button_text: 'Finish',
      fullName: '',
      phoneNumber: '111-111-1111',
      errors: [],
    }
  },

  /* Methods */
  finish() {
    if (this.state.button_text === 'Validating...') return;
    const state = Object.assign({}, this.state);
    state.button_text = 'Validating...';
    this.setState(state);
    const valid = this.props.validatePage(2);
    state.button_text = 'Finish';
    if (valid) {
      this.props.finish(function() {
        this.setState(state);
      });
      return;
    }
    this.setState(state);
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

  decodeText(txt) {
    if (txt) {
      return he.decode(txt);
    }
    return '';
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
            User Information
          </Text>
          <View style={Styles.form.inputGroup}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.fullName)}
            </Text>
            <TextInput
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'fullName')}
              value={this.state.fullName}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder="Full Name"
            />
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.phoneNumber)}
            </Text>
            <TextInput
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'phoneNumber')}
              value={this.state.phoneNumber}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder="Phone Number"
            />
          </View>
          <View style={Styles.form.bottomForm}>
            <Button action={this.finish} color='primary' wide>
              {this.state.button_text}
            </Button>
          </View>
        </ScrollView>
      </View>
    )
  }
})

module.exports = RegistrationPagePart3
