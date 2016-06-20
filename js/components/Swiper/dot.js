'use strict'

import React from 'react';
import {
  Component,
  View,
} from 'react-native'

const Dot = React.createClass ({
  propTypes: {
    color: React.PropTypes.string,
    diameter: React.PropTypes.number,
    style: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      color: 'rgba(192, 192, 192, 1)',
      diameter: 10,
    }
  },

  render() {
    const { color, diameter } = this.props

    return (
      <View
        style={[{
          backgroundColor: color,
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          marginHorizontal: 3,
          marginVertical: 3,
        }, this.props.style]}
      />
    )
  }

})

module.exports = Dot;