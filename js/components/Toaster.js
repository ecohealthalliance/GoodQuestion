import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import pubsub from 'pubsub-js';
import {ToastChannels, ToastMessage} from '../models/messages/Toast';

import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Icon from 'react-native-vector-icons/FontAwesome';

const Toaster = React.createClass({
  inUse: false,
  subscriptions: {},

  propTypes: {
    navigator: React.PropTypes.object,
  },

  getInitialState() {
    // subscribe to the toast show channel and handle valid requests
    const subscription = pubsub.subscribe(ToastChannels.SHOW, (address, request) => {
      if (request instanceof ToastMessage) {
        this.showToast(request);
      }
    });
    this.subscriptions[ToastChannels.SHOW] = subscription;

    return {
      title: '',
      text: '',
      icon: 'check',
      duration: 0,
      iconColor: Color.fadedGreen,
      fadeAnim: new Animated.Value(0.0),
      translateAnim: new Animated.Value(300),
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

  /* Methods */
  handlePress() {
    this.closeToast();
    this.state.action();
  },

  /**
   * shows a toast message
   *
   * @param {object} toastMessage, an instanceof ToastMessage from pubsub
   */
  showToast(toastMessage) {
    if (this.inUse || !this.subscriptions.hasOwnProperty(ToastChannels.SHOW)) {
      return;
    }

    this.inUse = true;
    this.state.fadeAnim.setValue(0);
    this.state.translateAnim.setValue(150);

    Animated.timing(
      this.state.fadeAnim,
      {toValue: 1, duration: 500, easing: Easing.out(Easing.quad)}
    ).start();
    Animated.timing(
      this.state.translateAnim,
      {toValue: 0, duration: 500, easing: Easing.out(Easing.quad)}
    ).start();

    this.setState({
      title: toastMessage.title,
      text: toastMessage.message,
      icon: toastMessage.icon,
      iconColor: toastMessage.iconColor,
      duration: toastMessage.duration || 4,
      action: toastMessage.action,
    });

    // Prevent toast from being re-used in quick sucession.
    if (toastMessage.duration && toastMessage.duration >= 2) {
      setTimeout(() => {
        this.inUse = false;
      }, 2000);
    }

    this.closeTimeout = setTimeout(() => {
      this.closeToast();
    }, toastMessage.duration * 1000);
  },

  closeToast() {
    this.inUse = false;
    Animated.timing(
      this.state.fadeAnim,
      {toValue: 0.1, duration: 400, easing: Easing.out(Easing.quad)}
    ).start();
    Animated.timing(
      this.state.translateAnim,
      {toValue: 300, duration: 1200, easing: Easing.out(Easing.quad)}
    ).start();
  },

  /* Render */

  render() {
    return (
      <Animated.View
        style={[Styles.toast.wrapper, {
          opacity: this.state.fadeAnim,
          transform: [
            {translateY: this.state.translateAnim},
          ],
        }]}
      >
        <TouchableOpacity onPress={this.handlePress}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={Styles.toast.icon}>
              <Icon name={this.state.icon} size={38} color={this.state.iconColor} />
            </View>
            <View style={Styles.toast.container}>
              <Text style={Styles.toast.title}>{this.state.title}</Text>
              <Text style={Styles.toast.text}>{this.state.text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
});

module.exports = Toaster;
