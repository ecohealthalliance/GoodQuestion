import React, {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Button from './Button'

import Icon from 'react-native-vector-icons/FontAwesome'

const SurveyListFilter = React.createClass ({
  propTypes: {
    filterList: React.PropTypes.func.isRequired,
  },

  /* Methods */
  handlePress(filter) {
    this.props.filterList(filter)
  },

  /* Render */
  render() {
    return (
      <View style={Styles.survey.listfilter}>
        <Button action={this.handlePress} style={[Styles.container.col25, {margin: 5}]}>
          <Text> AAA </Text>
        </Button>
        <Button action={this.handlePress} style={[Styles.container.col25, {margin: 5}]}>
          <Text> AAA </Text>
        </Button>
        <Button action={this.handlePress} style={[Styles.container.col25, {margin: 5}]}>
          <Text> AAA </Text>
        </Button>
        <Button action={this.handlePress} style={[Styles.container.col25, {margin: 5}]}>
          <Text> AAA </Text>
        </Button>
      </View>
    )
  }
})

module.exports = SurveyListFilter
