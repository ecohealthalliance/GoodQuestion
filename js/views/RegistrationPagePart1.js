
import React, {
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from 'react-native'

import Styles from '../styles/Styles'
import Button from '../components/Button'


const RegistrationPagePart1 = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      emailInput: '',
      verificationCodeInput: '',
    }
  },

  /* Methods */
  goToTermsPage() {
    this.props.navigator.push({path: 'terms', title: 'Terms of Service'})
  },

  goToNextPage() {
    this.props.navigator.push({path: 'registration2', title: 'Register'})
  },

  /* Render */
  render() {
    return (
      <View style={{flex: 1}}>
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
        <View style={Styles.form.bottomForm}>
          <Button action={this.goToNextPage} color='primary' wide>
            Next
          </Button>
        </View>
      </View>
      
    )
  }
})

module.exports = RegistrationPagePart1