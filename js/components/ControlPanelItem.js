import React, {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import Color from '../styles/Color';
import Styles from '../styles/Styles';

const _styles = StyleSheet.create({
  counter: {
    position: 'absolute',
    top: 17,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: Color.warning,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: Color.background2,
    fontWeight: 'bold',
  },
});

export default React.createClass({
  getInitialState() {
    return {
      counter: 25,
    };
  },

  /* Render */
  render() {
    return (
      <View style={Styles.controlPanel.itemContainer}>
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={[Styles.controlPanel.item]}>
            <Text style={Styles.controlPanel.itemText}>{this.props.text}</Text>
            {
              this.state.counter > 0
              ? <View style={_styles.counter}>
                  <Text style={_styles.counterText}>{this.state.counter}</Text>
                </View>
              : null
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
});
