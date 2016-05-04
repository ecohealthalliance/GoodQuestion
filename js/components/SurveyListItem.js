import React, {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

import CheckBox from 'react-native-checkbox'
import Icon from 'react-native-vector-icons/FontAwesome'

let uncheckedComponent = (<Icon name='circle-o' size={28} color={Color.fadedRed} />);
let checkedComponent = (<Icon name='check-circle' size={28} color={Color.fadedGreen} />);

const SurveyListItem = React.createClass ({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onChecked: React.PropTypes.func.isRequired,
    onPressed: React.PropTypes.func.isRequired,
  },

  /* Render */
  render() {
    return (
      <View style={Styles.survey.listitem}>
        <TouchableWithoutFeedback onPress={this.props.onPressed}>
          <View style={Styles.container.col75}>
            <Text style={Styles.survey.title}>{this.props.item.title}</Text>
            <Text style={Styles.survey.subtitle}>A subtitle</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={[Styles.container.col25, {alignItems: 'flex-end'}]}>
          <CheckBox
            ref={this.props.item.objectId}
            checked={this.props.item.accepted}
            uncheckedComponent={uncheckedComponent}
            checkedComponent={checkedComponent}
            onChange={this.props.onChecked}
          />
        </View>
      </View>
    )
  }
});

module.exports = SurveyListItem;
