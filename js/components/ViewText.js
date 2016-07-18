// Reusable component to handle bug with Android devices no supporting paddingTop in Text components.
import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';

const ViewText = React.createClass({
  getDefaultProps() {
    return {
      style: {},
      textStyle: {},
    };
  },

  /* Render */
  render() {
    return (
      <View style={this.props.style}>
        <Text style={this.props.textStyle}>
          {this.props.children}
        </Text>
      </View>
    );
  },
});

module.exports = ViewText;
