import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';

import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
  },

  getInitialState() {
    const routeStack = this.props.navState.routeStack;
    const position = routeStack.length - 1;
    const title = routeStack[position].title;
    const path = routeStack[position].path;
    return {
      index: 0,
      title: title,
      path: path,
      bounceValue: new Animated.Value(0),
      fadeAnim: new Animated.Value(0),
      translateAnim: new Animated.Value(0),
    };
  },

  immediatelyRefresh() {
    // NoOp https://github.com/facebook/react-native/issues/6205
  },

  componentWillReceiveProps(nextProps) {
    this.updateTitle(nextProps.navigator);
  },

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {toValue: 1}
    ).start();
  },

  /* Methods */
  updateTitle(navigator, indexOffset = 0) {
    try {
      const routeStack = navigator.getCurrentRoutes();
      const position = routeStack.length - 1 - indexOffset;
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
      });
    } catch (e) {
      console.warn(e);
    }
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
      this.updateTitle(this.props.navigator, 1);
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
