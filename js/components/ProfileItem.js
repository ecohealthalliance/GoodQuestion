import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

export default React.createClass({
  carets: [
    <View style={Styles.profile.caretView}><Icon name='caret-up' size={24} color={Color.primary} /></View>,
    <View style={Styles.profile.caretView}><Icon name='caret-down' size={24} color={Color.primary} /></View>,
  ],
  getInitialState() {
    return {
      // using props to set initial value only
      collapsed: this.props.collapsed,
    };
  },
  render() {
    const icon = this.props.icon || null;
    let caret = this.carets[0];
    if (this.state.collapsed) {
      caret = this.carets[1];
    }
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({collapsed: !this.state.collapsed});
        }}>
          <View style={Styles.profile.itemContainer}>
            {icon}
            <View style={[Styles.profile.item]}>
              <Text style={Styles.profile.itemText}>{this.props.text}</Text>
            </View>
            {caret}
          </View>
        </TouchableWithoutFeedback>
        <Collapsible collapsed={this.state.collapsed}>
          <View style={Styles.profile.body}>
            {this.props.children}
          </View>
        </Collapsible>
      </View>
    );
  },
});
