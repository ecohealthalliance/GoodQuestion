// A placeholder view for integrating native navigation

import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  ScrollView,
  View
} from 'react-native'

import Button from '../components/Button'
import TermsOfService from '../data/TermsOfService'
import Styles from '../styles/Styles'

const TermsOfServicePage = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  /* Render */
  render() {
    return (
      <View style={[Styles.container.default , {flex: 1}]}>
        <ScrollView contentContainerStyle={Styles.container.informational}>
          <Text>
            {TermsOfService}
          </Text>
        </ScrollView>
      </View>
    )
  }
})

module.exports = TermsOfServicePage
