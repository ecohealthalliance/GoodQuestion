
import React, {
  Text,
  TextInput,
  View,
} from 'react-native'

import Button from '../components/Button'
import Styles from '../styles/Styles'
import Color from '../styles/Color'


const RegistrationPagePart4 = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },
  
  getInitialState() {
    return {
      nameInput: '',
      phoneInput: '',
      extraInput: '',
    }
  },

  /* Methods */
  handleAllowService() {
    // Call API for location permissions
  },

  /* Render */
  render() {
    return (
      <View style={Styles.container.compact}>
        <Text style={Styles.type.h1}>
          Allow Location Services
        </Text>
        <Text style={[Styles.type.h2, {textAlign: 'center'}]}>
          GoodQuestion administers surveys which may need access to your location.
        </Text>
        <Button action={this.handleAllowService} wide />
      </View>
    )
  }
})

module.exports = RegistrationPagePart4