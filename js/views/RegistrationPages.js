import React, {
  Platform,
  Alert,
  View,
  Image,
} from 'react-native';

import _ from 'lodash';
import Variables from '../styles/Variables';
import Styles from '../styles/Styles';
import Color from '../styles/Color';

import Swiper from '../components/Swiper/Swiper';

import RegistrationPagePart1 from '../views/RegistrationPagePart1';
import RegistrationPagePart2 from '../views/RegistrationPagePart2';
import RegistrationPagePart3 from '../views/RegistrationPagePart3';

import {register} from '../api/Account';

const logo = require('../images/logo_stacked.png');
const totalPages = 3;

const RegistrationPages = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    index: React.PropTypes.number,
  },

  alerts: 0,

  styles: {
    swiperContainer: {
      flex: 1,
      overflow: 'visible',
      borderColor: Color.background1,
      borderWidth: 1,
      borderTopWidth: Platform.OS === 'android' ? 20 : 1,
    },
    registrationHeader: {
      height: Variables.REGISTRATION_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.background1,
      paddingBottom: 25,
      marginBottom: 30,
    },
    dotStyle: {
      // flex: 1,
      // alignSelf: 'center',
      backgroundColor: Color.background2,
      borderColor: Color.background1,
      borderWidth: 1,
      width: 28,
      height: 28,
      borderRadius: 50,
      marginHorizontal: 8,
    },
  },

  getInitialState() {
    let index = 0;
    if (this.props.index) {
      index = this.props.index;
    }
    return { index };
  },

  componentWillMount() {
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.index) {
      this.setState({
        index: nextProps.index,
      });
    }
  },

  /**
   * validates the current page
   *
   * @return {boolean} true if valid
   */
  validatePage(pageNum) {
    let updatedPageNum = pageNum;
    if (typeof updatedPageNum === 'undefined') {
      updatedPageNum = `page${this.state.index}`;
    } else {
      updatedPageNum = `page${pageNum}`;
    }
    const currentPage = this.refs[updatedPageNum];
    let errors = [];
    if (typeof currentPage !== 'undefined') {
      if (currentPage.hasOwnProperty('joiValidate')) {
        errors = currentPage.joiValidate();
        console.log('errors: ', errors);
        if (errors.length > 0) {
          if (this.alerts < 1) {
            Alert.alert('Validation', 'The form errors need corrected to continue.');
          }
          this.alerts++;
          return false;
        }
      }
    }
    return true;
  },

  /**
   * event handler for the swiper, return false to stop, true to continue
   */
  beforePageChange(currentPage, nextPage) {
    const shouldContinue = this.validatePage();
    if (shouldContinue || nextPage >= 0 && nextPage < currentPage) {
      this.setIndex(nextPage);
      return true;
    }
    return false;
  },

  /**
   * finish user registration
   */
  finish(callback) {
    const props = {
      role: 'user',
    };
    let email = '';
    let password = '';
    for (let i = 0; i < totalPages; i++) {
      const pageNum = `page${i}`;
      const page = this.refs[pageNum];
      if (page.state.hasOwnProperty('email')) {
        email = page.state.email;
      }
      if (page.state.hasOwnProperty('password')) {
        password = page.state.password;
      }
      if (page.state.hasOwnProperty('acceptedTerms')) {
        props.acceptedTerms = page.state.acceptedTerms;
      }
      if (page.state.hasOwnProperty('allowLocationServices')) {
        props.allowLocationServices = page.state.allowLocationServices;
      }
      if (page.state.hasOwnProperty('name')) {
        props.name = page.state.name;
      }
      if (page.state.hasOwnProperty('phone')) {
        props.phone = page.state.phone;
      }
    }
    register(email, password, props, (err) => {
      if (err) {
        Alert.alert('Error', err);
        this.setIndex(0);
        callback();
      } else {
        Alert.alert('Success', 'You have successfully registered to Good Question');
        // go to the default route
        this.props.navigator.resetTo({});
      }
    });
  },

  setIndex(idx) {
    this.setState({index: idx});
  },

  emptyTextInputs(formInputs, state) {
    return _.find(formInputs, (formInput) => {
      return !state[formInput];
    });
  },

  buttonStyles(registrationView, formInputs) {
    const buttonStyles = [Styles.form.footerButton];
    const buttonTextStyles = [Styles.form.registerText, Styles.form.registerTextInactive];
    const state = registrationView.state;
    if (_.isEmpty(state.errors) && !this.emptyTextInputs(formInputs, state)) {
      buttonStyles.push(Styles.form.footerButtonActive);
      buttonTextStyles.push(Styles.form.registerTextActive);
    }
    registrationView.buttonStyles = buttonStyles;
    registrationView.buttonTextStyles = buttonTextStyles;
  },

  getChildren() {
    const sharedProps = Object.assign({
      validatePage: this.validatePage,
      setIndex: this.setIndex,
      buttonStyles: this.buttonStyles,
    }, this.props);
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      let pageNum = `page${i}`;
      if (i === 0) {
        pages.push(<View key={i}><RegistrationPagePart1 ref={pageNum} {...sharedProps} /></View>);
      } else if (i === 1) {
        pages.push(<View key={i}><RegistrationPagePart2 ref={pageNum} {...sharedProps} /></View>);
      } else {
        pages.push(<View key={i}><RegistrationPagePart3 ref={pageNum} {...sharedProps} finish={this.finish} /></View>);
      }
    }
    return pages;
  },

  /* Render */
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={[Styles.header.banner, {paddingBottom: Platform.OS === 'android' ? 5 : 25}]}>
          <Image source={logo} style={Styles.header.logo}></Image>
        </View>
        <Swiper
          index={this.state.index}
          containerStyle={this.styles.swiperContainer}
          loop={false}
          pager={true}
          onPageChange={(pageNum) => {
            console.log(pageNum);
          }}
          beforePageChange={this.beforePageChange}
          dotContainerStyle={{top: -16, bottom: null}}
          dotStyle={this.styles.dotStyle}
          activeDotStyle={[this.styles.dotStyle, {backgroundColor: Color.primary, borderColor: Color.primary}]}
          children={this.getChildren()}>
        </Swiper>
      </View>
    );
  },
});

module.exports = RegistrationPages;
