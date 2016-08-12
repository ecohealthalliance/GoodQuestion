import pubsub from 'pubsub-js';
import {ToastAddresses, ToastMessage} from '../models/messages/ToastMessage';

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Icon from 'react-native-vector-icons/FontAwesome';


const Toaster = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
  },

  getInitialState() {
    // subscribe to the pubsub channel SHOW and handle valid requests
    pubsub.subscribe(ToastAddresses.SHOW, (address, request) => {
      if (request instanceof ToastMessage) {
        this.showToast(request);
      }
    });

    return {
      title: '',
      text: '',
      icon: 'check',
      iconColor: Color.fadedGreen,
      fadeAnim: new Animated.Value(0.0),
      translateAnim: new Animated.Value(300),
    };
  },

  /* Methods */
  handlePress() {
    this.closeToast();
  },

  /**
   * shows a toast message
   *
   * @param {object} toastMessage, an instanceof ToastMessage from pubsub
   */
  showToast(toastMessage) {
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
      duration: toastMessage.duration,
    });

    this.closeTimeout = setTimeout(() => {
      this.closeToast();
    }, toastMessage.duration * 1000);

  },

  closeToast() {
    Animated.timing(
      this.state.fadeAnim,
      {toValue: 0, duration: 400, easing: Easing.out(Easing.quad)}
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
