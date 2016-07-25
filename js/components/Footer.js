import React, {
  Keyboard,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

const _style = StyleSheet.create({
  container: {
    // position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  }
});

const Footer = React.createClass({
  propTypes: {
    hideWithKeyboard: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      hideWithKeyboard: true,
    }
  },

  getInitialState() {
    return {
      keyboardOpen: false,
    };
  },

  componentWillMount () {
    // if (Platform.OS === 'ios') {
      Keyboard.addListener(Keyboard, 'keyboardWillShow', this.keyboardWillShow);
      Keyboard.addListener(Keyboard, 'keyboardWillHide', this.keyboardWillHide);
    // } else {
      // Keyboard.addListener(Keyboard, 'KeyboardDidShow', this.keyboardWillShow);
      // Keyboard.addListener(Keyboard, 'KeyboardDidHide', this.keyboardWillHide);
    // }
  },

  /* Methods */
  keyboardWillShow() {
    console.warn('keyboardWillShow')
    console.warn('keyboardWillShow')
    console.warn('keyboardWillShow')
    this.setState({
      keyboardOpen: true,
    });
  },

  keyboardWillHide() {
    console.warn('keyboardWillHide')
    console.warn('keyboardWillHide')
    console.warn('keyboardWillHide')
    this.setState({
      keyboardOpen: false,
    });
  },

  /* Render */
  render() {
    let dynamicContainer = {};

    if (this.props.hideWithKeyboard && this.state.keyboardOpen) {
      dynamicContainer = {
        height: 100,
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
