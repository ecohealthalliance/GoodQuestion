import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connectToaster } from '../api/Notifications'

const Toaster = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object,
  },

  getInitialState() {
    return {
      title: 'Title',
      text: 'Yea toast!',
      icon: 'circle-o',
      duration: 10,
      action: () => {},
      fadeAnim: new Animated.Value(0.0),
      translateAnim: new Animated.Value(300),
    }
  },

  componentDidMount() {
    connectToaster(this);
    const self = this;
  },

  /* Methods */
  handlePress() {
    this.closeToast();
    this.state.action();
  },

  showToast(title, message, icon, duration, action) {
    console.log('showToast')
    const self = this;

    this.state.fadeAnim.setValue(0);
    this.state.translateAnim.setValue(150);

    Animated.timing(
      this.state.fadeAnim,
      {toValue: 1, duration: 500, easing: Easing.out(Easing.quad),}
    ).start();
    Animated.timing(
      this.state.translateAnim,
      {toValue: 0, duration: 500, easing: Easing.out(Easing.quad),}
    ).start();

    this.setState({
      title: title,
      text: message,
      icon: icon,
      duration: 6,
      action: action,
    });

    this.closeTimeout = setTimeout(() => {
      self.closeToast()
    }, duration * 1000);
  },

  closeToast() {
    Animated.timing(
      this.state.fadeAnim,
      {toValue: 0, duration: 400, easing: Easing.out(Easing.quad),}
    ).start();
    Animated.timing(
      this.state.translateAnim,
      {toValue: 50, duration: 1200, easing: Easing.out(Easing.quad),}
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
              <Icon name={this.state.icon} size={38} color={Color.faded} />
            </View>
            <View style={Styles.toast.container}>
              <Text style={Styles.toast.title}>{this.state.title}</Text>
              <Text style={Styles.toast.text}>{this.state.text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
})

module.exports = Toaster
