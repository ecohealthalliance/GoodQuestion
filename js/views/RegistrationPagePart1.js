
import React, {
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from 'react-native'

import Link from '../components/Link'
import Styles from '../styles/Styles'


const RegistrationPagePart1 = React.createClass ({
  getInitialState() {
    return {
      emailInput: '',
      verificationCodeInput: '',
    }
  },

  /* Methods */
  goToTermsPage() {

  },

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
        <TouchableWithoutFeedback onPress={this.goToTermsPage}>
          <Text style={Styles.type.h3}>
            <Text>By verifying your account you agree to GoodQuestion </Text>
            <Text style={Styles.type.link}>Terms of Service.</Text>
          </Text>
        </TouchableWithoutFeedback>
        
      </View>
    )
  }
})

module.exports = RegistrationPagePart1