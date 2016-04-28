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
  
  /* Methods */
  handleAccept() {
    // Accept the terms of service
  },

  /* Render */
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={Styles.container.informational}>
          <Text>
            {TermsOfService}
          </Text>
        </ScrollView>
        <View style={Styles.form.fixedForm}>
          <Button action={this.handleAccept} />
        </View>
      </View>
    )
  }
})

module.exports = TermsOfServicePage