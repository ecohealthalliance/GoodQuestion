import React, {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

const Notification = React.createClass ({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onPressed: React.PropTypes.func.isRequired,
  },

  /* Render */
  render() {
    return (
      <View style={Styles.survey.listitem}>
        <TouchableWithoutFeedback onPress={this.props.onPressed}>
          <View>
            <Text style={Styles.survey.title}>{this.props.item.title}</Text>
            <Text style={Styles.survey.subtitle}>{this.props.item.description}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
});

module.exports = Notification;
