import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Dot from './dot';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

const Dots = React.createClass({
  propTypes: {
    total: React.PropTypes.number,
    active: React.PropTypes.number,
    style: View.propTypes.style,
    dotStyle: View.propTypes.style,
    activeDotStyle: View.propTypes.style,
    activeColor: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      total: 0,
      active: -1,
      dotStyle: {},
      activeDotStyle: {},
    };
  },

  render() {
    const { total, active } = this.props;
    const range = Array.from(new Array(total), (x, i) => i);
    return (
      <View style={[styles.container, this.props.style]}>
       { range.map((i) => {
          return (
            <Dot
              key={ i }
              color={ i === active ? this.props.activeColor : this.props.color }
              style={ i === active ? this.props.activeDotStyle : this.props.dotStyle }
            />
          );
        })}
      </View>
    );
  },
});

module.exports = Dots;
