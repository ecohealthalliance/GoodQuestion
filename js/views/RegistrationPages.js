import React, {
  Alert,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'

import Styles from '../styles/Styles'
import Button from '../components/Button'
import Color from '../styles/Color'

import Swiper from '../lib/react-native-page-swiper'

import RegistrationPagePart1 from '../views/RegistrationPagePart1'
import RegistrationPagePart2 from '../views/RegistrationPagePart2'
import RegistrationPagePart3 from '../views/RegistrationPagePart3'

const totalPages = 3;

const RegistrationPages = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    index: React.PropTypes.number,
  },

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
    this.props.setTitle(' ');
  },

  componentWillReceiveProps(nextProps) {
    let state = Object.assign({}, this.state);
    if (nextProps.index) {
      state.index = nextProps.index;
      this.setState(state);
    }
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
          Alert.alert('Validation', 'The form errors need corrected to continue.');
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
    let user = {}
    for (let i = 0; i < totalPages; i++) {
      let pageNum = 'page'+i;
      let page = this.refs[pageNum];
      if (page.state.hasOwnProperty('email')) {
        user.email = page.state.email;
      }
      if (page.state.hasOwnProperty('password')) {
        user.password = page.state.password;
      }
      if (page.state.hasOwnProperty('terms')) {
        user.acceptedTerms = page.state.terms;
      }
      if (page.state.hasOwnProperty('allowLocationServices')) {
        user.allowLocationServices = page.state.allowLocationServices;
      }
      if (page.state.hasOwnProperty('fullName')) {
        user.fullName = page.state.fullName;
      }
      if (page.state.hasOwnProperty('phoneNumber')) {
        user.phoneNumber = page.state.phoneNumber;
      }
    }
    Alert.alert('User', JSON.stringify(user));
    // TODO - register the user on forgerock and parse-server
  },

  setIndex(idx) {
    this.setState({index: idx});
  },

  getChildren() {
    let pages = [];
    for (let i = 0; i < totalPages; i++) {
      let pageNum = 'page'+i;
      if (i === 0) {
        pages.push((<View key={i}><RegistrationPagePart1 ref={pageNum} {...this.props} validatePage={this.validatePage} setIndex={this.setIndex} /></View>));
      } else if ( i === 1) {
        pages.push((<View key={i}><RegistrationPagePart2 ref={pageNum} {...this.props} validatePage={this.validatePage} setIndex={this.setIndex} /></View>));
      } else {
        pages.push((<View key={i}><RegistrationPagePart3 ref={pageNum} {...this.props} validatePage={this.validatePage} setIndex={this.setIndex} finish={this.finish} /></View>));
      }
    }
    return pages;
  },

  /* Render */
  render() {
    return (
      <Swiper
        style={{flex: 1}}
        activeDotColor={Color.background1}
        index={this.state.index}
        beforePageChange={this.beforePageChange}
        onPageChange={this.onPageChange}
        children={this.getChildren()}
        threshold={50}>
      </Swiper>
    )
  }
})

module.exports = RegistrationPages
