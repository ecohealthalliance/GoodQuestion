
import React, {
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';

import Variables from '../styles/Variables';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Styles from '../styles/Styles';

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';

const RegistrationPagePart3 = React.createClass({
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
    'name',
    'phone',
  ],

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    name: Joi.string().min(3).required().options(
      {language: {any: {allowOnly: 'must not be empty'}}}).label('Full Name'),
    phone: Joi.string().optional().label('Phone Number'),
  },

  getInitialState() {
    return {
      buttonText: 'Finish',
      name: '',
      phone: '',
      errors: [],
    };
  },

  /* Methods */
  finish() {
    if (this.state.buttonText === 'Sending...') {
      return;
    }
    this.setState({
      buttonText: 'Sending...',
    });
    const valid = this.props.validatePage(2);
    if (valid) {
      this.props.finish(() => {
        this.setState({
          buttonText: 'Finish',
        });
      });
    } else {
      this.setState({
        buttonText: 'Finish',
      });
    }
  },

  /* Render */
  render() {
    this.props.buttonStyles(this, this.formInputs);
    return (
      <View style={[Styles.container.defaultWhite]}>
        <ScrollView
          ref='scrollView'
          style={Styles.form.registrationView}>
          <Text style={[Styles.type.h1, {textAlign: 'center'}]} >
            User Information
          </Text>
          <View style={Styles.form.inputGroup}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.name)}
            </Text>
            <View ref='nameView'>
              <TextInput
                ref='name'
                style={Styles.form.input}
                onChangeText={this.textFieldChangeHandler.bind(this, 'name')}
                onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'nameView', Variables.REGISTRATION_HEIGHT)}
                onBlur={this.trimText.bind(this, 'name')}
                value={this.state.name}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Full Name'
              />
            </View>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.phone)}
            </Text>
            <View ref='phoneView'>
              <TextInput
                ref='phone'
                style={Styles.form.input}
                onChangeText={this.textFieldChangeHandler.bind(this, 'phone')}
                onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'phoneView', Variables.REGISTRATION_HEIGHT)}
                onBlur={this.trimText.bind(this, 'phone')}
                value={this.state.phone}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                placeholder='Phone Number'
              />
            </View>
          </View>
        </ScrollView>
        <Footer>
          <Button action={this.finish} style={this.buttonStyles} textStyle={this.buttonTextStyles}>
            {this.state.buttonText}
          </Button>
        </Footer>
      </View>
    );
  },
});

module.exports = RegistrationPagePart3;
