
import React, {
  Text,
  TextInput,
  View,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'


const RegistrationPagePart1 = React.createClass ({
  getInitialState() {
    return {
      emailInput: '',
      verificationCodeInput: '',
    }
  },

  /* Methods */

  /* Render */
  render() {
    return (
      <View style={Styles.container.compact}>
        <Text style={Styles.type.h1}>
          Verify Email
        </Text>
        <TextInput
          style={Styles.form.inputWide}
          onChangeText={(emailInput) => this.setState({emailInput})}
          value={this.state.emailInput}
          placeholder="Login"
        />
        <TextInput
          style={Styles.form.inputWide}
          onChangeText={(verificationCodeInput) => this.setState({verificationCodeInput})}
          value={this.state.verificationCodeInput}
          placeholder="Verification Code"
        />
        <Text style={Styles.type.h3}>
          By verifying your account you agree to GoodQuestion Terms of Service.
        </Text>
      </View>
    )
  }
})

module.exports = RegistrationPagePart1