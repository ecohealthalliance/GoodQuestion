import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

import pubsub from 'pubsub-js';
import { NotificationChannels } from '../models/messages/Notification';

import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from '../styles/Styles';
import Color from '../styles/Color';

import Store from '../data/Store';

const _styles = StyleSheet.create({
  notificationIcon: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: Color.warning,
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Color.background1,
  },
});

const Header = React.createClass({
  subscriptions: {},

  propTypes: {
    navigator: React.PropTypes.object,
  },

  getInitialState() {
    // subscript to the notification create channel
    const subscription = pubsub.subscribe(NotificationChannels.CREATE, () => {
      this.updateTitle();
    });
    this.subscriptions[NotificationChannels.CREATE] = subscription;

    const routeStack = this.props.navState.routeStack;
    const position = routeStack.length - 1;
    const title = routeStack && routeStack[position] ? routeStack[position].title : '';
    const path = routeStack && routeStack[position] ? routeStack[position].path : '';
    return {
      index: 0,
      title: title,
      path: path,
      bounceValue: new Animated.Value(0),
      fadeAnim: new Animated.Value(0),
      translateAnim: new Animated.Value(0),
      hasNewNotifications: Store.newNotifications > 0,
    };
  },

  componentWillUnmount() {
    const keys = Object.keys(this.subscriptions);
    if (keys.length > 0) {
      keys.forEach((key) => {
        pubsub.unsubscribe(this.subscriptions[key]);
      });
      this.subscriptions = {};
    }
  },

  immediatelyRefresh() {
    // NoOp https://github.com/facebook/react-native/issues/6205
  },

  componentWillReceiveProps() {
    this.updateTitle();
  },

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {toValue: 1}
    ).start();
  },

  /* Methods */
  updateTitle(indexOffset = 0) {
    if (Store.navigator) {
      const routeStack = Store.navigator.getCurrentRoutes();
      const position = routeStack.length - 1 - indexOffset;
      if (!routeStack[position]) {
        return;
      }

      let title = this.state.title;
      let path = this.state.path;
      const nextTitle = routeStack[position].title;
      const nextPath = routeStack[position].path;

      if (nextPath && nextPath !== path || nextTitle && nextTitle !== title) {
        path = nextPath;
        title = nextTitle;

        this.state.fadeAnim.setValue(0.5);
        this.state.translateAnim.setValue(indexOffset ? -10 : 10);
        Animated.timing(
          this.state.fadeAnim,
          {toValue: 1, duration: 300, easing: Easing.out(Easing.quad)}
        ).start();
        Animated.timing(
          this.state.translateAnim,
          {toValue: 0, duration: 300, easing: Easing.out(Easing.quad)}
        ).start();
      }
      this.setState({
        title: title,
        index: position,
        path: path,
        hasNewNotifications: Store.newNotifications,
      });
    }
  },

  updateNotifications() {
    this.setState({hasNewNotifications: Store.newNotifications > 0});
  },

  backToLogin() {
    this.props.navigator.resetTo({path: 'login', title: ''});
    this.setState({title: ''});
  },

  navigateBack() {
    if (this.state.path === 'registration') {
      Alert.alert(
        'Exit registration?',
        '',
        [
          {text: 'OK', onPress: () => this.backToLogin()},
          {text: 'Cancel', style: 'cancel'},
        ]
      );
    } else {
      this.updateTitle(1);
      this.props.navigator.pop();
    }
  },

  /* Render */
  renderDrawer() {
    if (typeof this.props.openDrawer === 'undefined') {
      return (
        <View style={Styles.header.navBarRightButton}></View>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={this.props.openDrawer}>
        <View style={Styles.header.navBarRightButton}>
          <Icon name='bars' size={25} color='#FFFFFF' />
          {
            this.state.hasNewNotifications
            ? <View style={_styles.notificationIcon} />
            : null
          }
        </View>
      </TouchableWithoutFeedback>
    );
  },

  renderIOSPadding() {
    if (Platform.OS === 'ios') {
      return (
        <View style={Styles.header.iOSPadding}></View>
      );
    }
  },

  render() {
    let title = this.state.title;
    let navbarStyles = [Styles.header.navBar];

    switch (this.state.path) {
      case 'none':
      case 'login':
      case 'registration':
      case 'forgotPassword':
      case 'verifyForgotPassword':
        navbarStyles.push(Styles.header.navBarClear);
        title = '';
        break;
      default:
    }

    return (
      <View style={navbarStyles}>
        {this.renderIOSPadding()}
        <TouchableWithoutFeedback onPress={this.navigateBack}>
          {
          this.state.index > 0
            ? <View style={Styles.header.navBarLeftButton}><Icon name='chevron-left' size={25} color='#FFFFFF' /></View>
            : <View style={Styles.header.navBarLeftButton}><Icon name='chevron-left' size={25} color={Color.background1} /></View>
          }
        </TouchableWithoutFeedback>
        <View style={Styles.header.navBarTitle}>
          <Animated.Text
            source={{uri: 'http://i.imgur.com/XMKOH81.jpg'}}
            style={[Styles.header.navBarTitleText, {
              opacity: this.state.fadeAnim,
              transform: [
                {translateX: this.state.translateAnim},
              ],
            }]}
          >
          {title}
          </Animated.Text>
        </View>
        {this.renderDrawer()}
      </View>
    );
  },
});

module.exports = Header;
