import React, {
  Alert,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native'

import Variables from '../styles/Variables'
import Styles from '../styles/Styles'
import Button from '../components/Button'
import Color from '../styles/Color'

import Swiper from 'react-native-page-swiper'

import RegistrationPagePart1 from '../views/RegistrationPagePart1'
import RegistrationPagePart2 from '../views/RegistrationPagePart2'
import RegistrationPagePart3 from '../views/RegistrationPagePart3'

import {register} from '../api/Account'

const {height, width} = Dimensions.get('window')
const totalPages = 3;

const RegistrationPages = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    index: React.PropTypes.number,
  },
  alerts: 0,
  getInitialState() {
    let index = 0
    if (this.props.index) {
      index = this.props.index;
    }
    return {
      index: index,
    }
  },

  componentWillMount() {
  },

  componentWillReceiveProps(nextProps) {
    let state = Object.assign({}, this.state);
    if (nextProps.index) {
      state.index = nextProps.index;
      this.setState(state);
    }
  },

  /**
   * dynamically calculate scroll view height
   *
   * @return {number} ideal height of the ScrollView
   */
  calculateScrollViewHeight() {
    return height - (Variables.HEADER_SIZE + Variables.REGISTRATION_HEIGHT + 80);
  },

  /**
   * validates the current page
   *
   * @return {boolean} true if valid
   */
  validatePage(pageNum) {
    if (typeof pageNum === 'undefined') {
      pageNum = 'page' + this.state.index;
    } else {
      pageNum = 'page' + pageNum;
    }
    const currentPage = this.refs[pageNum]
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
  beforePageChange(nextPage) {
    const shouldContinue = this.validatePage();
    if (!shouldContinue) {
      return false;
    }
    this.setIndex(nextPage);
    return true;
  },

  /**
   * finish user registration
   */
  finish() {
    const self = this;
    const props = {
      role: 'user',
    };
    let email = '';
    let password = '';
    for (let i = 0; i < totalPages; i++) {
      const pageNum = 'page'+i;
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
    register(email, password, props, function(err, success) {
      if (err) {
        Alert.alert('Error', err);
        return;
      }
      Alert.alert('Success', 'You have successfully registered to Good Question');
      // go to the default route
      self.props.navigator.replace({});
    });
  },

  setIndex(idx) {
    this.setState({index: idx});
  },

  getChildren() {
    const sharedProps = Object.assign({
      calculateScrollViewHeight: this.calculateScrollViewHeight,
      validatePage: this.validatePage,
      setIndex: this.setIndex,
    }, this.props);
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      let pageNum = 'page'+i;
      if (i === 0) {
        pages.push((<View key={i}><RegistrationPagePart1 ref={pageNum} {...sharedProps} /></View>));
      } else if ( i === 1) {
        pages.push((<View key={i}><RegistrationPagePart2 ref={pageNum} {...sharedProps} /></View>));
      } else {
        pages.push((<View key={i}><RegistrationPagePart3 ref={pageNum} {...sharedProps} finish={this.finish} /></View>));
      }
    }
    return pages;
  },

  /* Render */
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Swiper
          activeDotColor={Color.background1}
          index={this.state.index}
          beforePageChange={this.beforePageChange}
          onPageChange={this.onPageChange}
          children={this.getChildren()}
          threshold={75}>
        </Swiper>
      </View>
    )
  }
})

module.exports = RegistrationPages
