import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Styles from '../styles/Styles';

export default React.createClass({
  render() {
    return (
      <View style={Styles.controlPanel.itemContainer}>
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={[Styles.controlPanel.item, this.props.style]}>
            <Text style={Styles.controlPanel.itemText}>{this.props.text}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
});
