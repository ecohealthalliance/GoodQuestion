
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
import EventMixins from '../mixins/event-mixins'

const RegistrationPagePart3 = React.createClass ({
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

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    name: Joi.string().min(3).required().options({language: {any: {allowOnly: 'must not be empty'}}}).label('Full Name'),
    phone: Joi.string().optional().label('Phone Number'),
  },

  getInitialState() {
    return {
      button_text: 'Finish',
      name: '',
      phone: '',
      errors: [],
    }
  },

  /* Methods */
  finish() {
    if (this.state.button_text === 'Sending...') return;
    this.setState({
      button_text: 'Sending...'
    });
    const valid = this.props.validatePage(2);
    if (valid) {
      this.props.finish(() => {
        this.setState({
          button_text: 'Finish'
        });
      });
    } else {
      this.setState({
        button_text: 'Finish'
      });
    }
  },

  /* Render */
  render() {
    return (
      <View style={[Styles.container.defaultWhite]}>
        <ScrollView style={{height: this.props.calculateScrollViewHeight(), paddingTop: 15}}>
          <Text style={[Styles.type.h1, {textAlign: 'center'}]} >
            User Information
          </Text>
          <View style={Styles.form.inputGroup}>
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.name)}
            </Text>
            <TextInput
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'name')}
              value={this.state.name}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder="Full Name"
            />
            <Text style={Styles.form.errorText}>
              {this.decodeText(this.state.errors.phone)}
            </Text>
            <TextInput
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'phone')}
              value={this.state.phone}
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
