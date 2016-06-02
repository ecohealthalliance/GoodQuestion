
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

import Checkbox from 'react-native-checkbox'
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

  renderLocationServices() {
    return (
      <Text style={[Styles.type.h3, {textAlign: 'center', paddingBottom: 2}]}>
        <Text>I accept the use of location services.</Text>
      </Text>
    );
  },

  /* Render */
  render() {
    return (
      <View style={[Styles.container.defaultWhite]}>
        <ScrollView style={{height: this.props.calculateScrollViewHeight(), paddingTop: 15}}>
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

module.exports = RegistrationPagePart4
