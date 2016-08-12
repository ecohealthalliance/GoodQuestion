import React, {
  View,
  Animated,
  Easing,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

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

  componentDidMount() {
    this._animate();
  },

  render() {
    const container = this.props.style ? this.props.style : {flex: 1, justifyContent: 'center', alignItems: 'center'};
    const size = this.props.size ? this.props.size : 120;
    const animation = {transform: [
      {rotate: this.state.angle.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      })},
    ]};
    return (
      <View style={container}>
        <Animated.View style={animation}>
          <Icon name='spinner' size={size} color='#eee'/>
        </Animated.View>
      </View>
    );
  },
});

module.exports = Loading;
