
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
import he from 'he' // HTML entity encode and decode

const RegistrationPagePart4 = React.createClass ({

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
    allowLocationServices: Joi.boolean().required().invalid(false).label('Terms of Service'),
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

  decodeText(txt) {
    if (txt) {
      return he.decode(txt);
    }
    return '';
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
      <View>
        <View style={this.styles.registrationHeader}>
          <Image source={require('../images/logo_stacked.png')} style={this.styles.logo}></Image>
        </View>
        <ScrollView style={{height: 400}}>
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
                onChange={(checked)=>{
                  this.setState({allowLocationServices: checked});
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

module.exports = RegistrationPagePart4
