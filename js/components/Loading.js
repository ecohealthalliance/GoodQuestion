import React from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';

import Color from '../styles/Color';

/**
 * provides for an animted loading component
 *
 * @note based off the following gist https://gist.github.com/cssoul/eda63b173311a323653b
 */
const Loading = React.createClass({

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
      easing: Easing.linear,
    }).start(this._animate);
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

    // Use a default loading animation for Android until RN gets native custom animation support.
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
        {this.props.text
          ? <Text style={textStyle}>
              {this.props.text}
            </Text>
          : null}
      </View>
    );
  },
});

module.exports = Loading;
