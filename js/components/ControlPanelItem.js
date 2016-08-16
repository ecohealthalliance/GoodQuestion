import React from 'react';
import {
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
    top: 19,
    right: 3,
    width: 26,
    height: 26,
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
  propTypes: {
    counter: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      counter: 0,
    };
  },

  getInitialState() {
    return {
      counter: this.props.counter,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      counter: nextProps.counter,
    });
  },

  /* Render */
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
