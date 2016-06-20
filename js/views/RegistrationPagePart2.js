
import React from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  ScrollView,
} from 'react-native'

import Button from '../components/Button'
import CheckBox from '../components/Checkbox'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

import Icon from 'react-native-vector-icons/FontAwesome'

let uncheckedComponent = (<Icon name='square-o' size={30} />);
let checkedComponent = (<Icon name='check-square-o' size={30} />);

import Joi from '../lib/joi-browser.min'
import JoiMixins from '../mixins/joi-mixins'
import EventMixins from '../mixins/event-mixins'

const RegistrationPagePart4 = React.createClass ({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  styles: {
    checkboxWrapper: {
      alignItems:'center',
      justifyContent:'center',
      marginLeft: 50,
      height: 35,
    },
  },

  formInputs: [
    'allowLocationServices',
  ],

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    allowLocationServices: Joi.boolean().required().invalid(false).options({language: {any: {invalid: 'must be accepted'}}}).label('Allow Location Services'),
  },


  getInitialState() {
    return {
      button_text: 'Next',
      allowLocationServices: false,
      errors: [],
    }
  },

  componentWillMount() {
  },

  /* Methods */
  goToNextPage() {
    const shouldContinue = this.props.validatePage(1);
    if (shouldContinue) {
      this.props.setIndex(2);
    }
  },

  /* Methods */
  handleAllowService() {
    // Call API for location permissions
  },

  buttonStyles() {
    let styles = [Styles.form.footerButton]
    if (_.isEmpty(this.state.errors) && this.state.email && this.state.password) {
      styles.push(Styles.form.footerButtonActive)
    }
    return styles
  },

  renderLocationServices() {
    return (
      <Text style={[Styles.type.h3, {textAlign: 'center', paddingBottom: 2}]}>
        <Text>I accept the use of location services.</Text>
      </Text>
    );
  },

  /* Render */
  render() {
    this.props.buttonStyles(this, this.formInputs)
    return (
      <View style={[Styles.container.defaultWhite]}>
        <ScrollView style={[Styles.form.registrationView, {height: this.props.calculateScrollViewHeight()}]}>
          <Text style={[Styles.type.h1, {textAlign: 'center'}]} >
            Location Services
          </Text>
          <View style={Styles.form.inputGroup}>
            <Text style={[Styles.type.h2, {textAlign: 'center'}]}>
              GoodQuestion administers surveys which may need access to your location.
            </Text>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.allowLocationServices)}
            </Text>
            <View style={this.styles.checkboxWrapper}>
              <Checkbox
                children={this.renderLocationServices()}
                checked={this.state.allowLocationServices}
                uncheckedComponent={uncheckedComponent}
                checkedComponent={checkedComponent}
                onChange={this.checkboxChangeHandler.bind(this, 'allowLocationServices')}
              />
            </View>
          </View>
        </ScrollView>
        <Button
          action={this.goToNextPage}
          style={this.buttonStyles}
          textStyle={this.buttonTextStyles}>
          {this.state.button_text}
        </Button>
      </View>
    )
  }
})

module.exports = RegistrationPagePart4
