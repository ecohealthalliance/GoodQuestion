import React from 'react';
import {
  // Keyboard,
  DeviceEventEmitter,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

const _style = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  },
});

const Footer = React.createClass({
  propTypes: {
    hideWithKeyboard: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      hideWithKeyboard: true,
    };
  },

  getInitialState() {
    return {
      keyboardOpen: false,
    };
  },

  componentDidMount() {
    const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    this._listeners = [
      DeviceEventEmitter.addListener(updateListener, this.handleKeyboardShow),
      DeviceEventEmitter.addListener(resetListener, this.handleKeyboardHide),
    ];
  },

  // RN 0.27+
  // componentDidMount() {
  //   const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
  //   const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
  //   this._listeners = [
  //     Keyboard.addListener(updateListener, this.handleKeyboardShow),
  //     Keyboard.addListener(resetListener, this.handleKeyboardHide)
  //   ];
  // },

  componentWillUnmount() {
    this._listeners.forEach((listener) => listener.remove());
  },

  /* Methods */
  handleKeyboardShow() {
    this.setState({
      keyboardOpen: true,
    });
  },

  handleKeyboardHide() {
    this.setState({
      keyboardOpen: false,
    });
  },

  /* Render */
  render() {
    let dynamicContainer = {};

    if (this.props.hideWithKeyboard && this.state.keyboardOpen) {
      dynamicContainer = {
        height: 1,
      };
    }
    return (
      <View style={[_style.container, this.props.style, dynamicContainer]}>
        {this.props.children}
      </View>
    );
  },
});

module.exports = Footer;
