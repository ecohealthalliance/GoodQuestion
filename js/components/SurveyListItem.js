import React, {
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

import CheckBox from 'react-native-checkbox'
import Icon from 'react-native-vector-icons/FontAwesome'

const SurveyListItem = React.createClass ({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onChecked: React.PropTypes.func.isRequired,
  },

  /* Render */
  renderIcon() {
    let icon
    switch(this.props.item.status) {
      case 'accepted': icon = <Icon name='check-circle' size={28} color={Color.fadedGreen} />; break;
      case 'declined': icon = <Icon name='times-circle' size={28} color={Color.fadedRed} />; break;
      default: icon = <Icon name='circle-o' size={28} color={Color.fadedRed} />; break;
    }
    return (
      <View style={{paddingTop: 4}}>
        {icon}
      </View>
    )
  },

  render() {
    return (
      <View style={Styles.survey.listitem}>
          <View style={Styles.container.col75}>
            <Text style={Styles.survey.title}>{this.props.item.title}</Text>
            <Text style={Styles.survey.subtitle}>A subtitle</Text>
          </View>
        <View style={[Styles.container.col25, {alignItems: 'flex-end'}]}>
          {this.renderIcon()}
        </View>
      </View>
    )
  }
});

module.exports = SurveyListItem;
