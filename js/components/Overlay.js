import React from 'react';
import {
  View,
} from 'react-native';

const Overlay = React.createClass ({
  // Android: zIndex property is not properly supported as of RN 0.29

  render() {
    const container = {
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 500,
    };
    
    return (
      <View style={[container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
})

module.exports = Overlay;