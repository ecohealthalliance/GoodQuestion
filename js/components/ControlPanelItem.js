import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Styles from '../styles/Styles';

export default React.createClass({
  render() {
    const icon = this.props.icon || null;
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={Styles.controlPanel.itemContainer}>
            <View style={[Styles.controlPanel.item, this.props.style]}>
              <Text style={Styles.controlPanel.itemText}>{this.props.text}</Text>
            </View>
            {icon}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
});
