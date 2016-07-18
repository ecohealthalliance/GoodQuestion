import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Styles from '../styles/Styles';

const Notification = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onPressed: React.PropTypes.func.isRequired,
  },

  /* Render */
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPressed}>
        <View style={Styles.survey.listitem}>
          <View>
            <Text style={Styles.survey.title}>{this.props.item.title}</Text>
            <Text style={Styles.survey.subtitle}>{this.props.item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
});

module.exports = Notification;
