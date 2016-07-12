import React from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Icon from 'react-native-vector-icons/FontAwesome'

/**
 * provides for an animted loading component
 *
 * @note based off the following gist https://gist.github.com/cssoul/eda63b173311a323653b
 */
const Loading = React.createClass ({

  getInitialState() {
    return {
      angle: new Animated.Value(0),
    };
  },

  _animate() {
    this.state.angle.setValue(0);
    this._anim = Animated.timing(this.state.angle, {
      toValue: 360,
      delay: 0,
      duration: 1500,
      easing: Easing.linear
    }).start(this._animate);
  },

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this._animate();
    }
  },

  render() {
    const container = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };
    const textStyle = {
      marginTop: 30,
      fontSize: 20,
      color: this.props.color || Color.primary,
      textAlign: 'center',
    };

    if (Platform.OS === 'ios') {
      const animation = {transform: [
        {rotate: this.state.angle.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg']
        })},
      ]};

      return (
        <View style={container}>
          <Animated.View style={animation}>
            <Icon name="spinner" size={120} color={this.props.color || Color.faded}/>
          </Animated.View>
          {this.props.text ?
            <Text style={textStyle}>
              {this.props.text}
            </Text>
          :null}
        </View>
      )

    } else {
      // Use a default loading animation for Android until RN gets custom native animation support.
      const animation = {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      };

      return (
        <View style={container}>
          <ActivityIndicator
            style={animation}
            size='large'
            color={ this.props.color || Color.primary }
          />
          {this.props.text ?
            <Text style={textStyle}>
              {this.props.text}
            </Text>
          :null}
        </View>
      )
    }
  }
})

module.exports = Loading
