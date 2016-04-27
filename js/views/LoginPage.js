
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

import { verifyLogin } from '../api/Account'


const LoginPage = React.createClass ({
  getInitialState() {
    return {
      emailInput: '',
      passwordInput: '',
      button_text: 'Verify',
    }
  },

  /* Methods */
  handleVerifyLogin(event) {
    event.preventDefault()

    this.setState({
      button_text: 'Verifying...'
    })

    verifyLogin(this.state.text, this.handleVerifyLoginResponse)
  },

  handleVerifyLoginResponse(response) {
    this.setState({
      button_text: 'Login Verified'
    })
  },

  /* Render */
  render() {
    return (
      <View style={Styles.container.default}>
        <TextInput
          style={Styles.form.input}
          onChangeText={(emailInput) => this.setState({emailInput})}
          value={this.state.emailInput}
          placeholder="Login"
        />
        <TextInput
          style={Styles.form.input}
          onChangeText={(passwordInput) => this.setState({passwordInput})}
          value={this.state.passwordInput}
          placeholder="Password"
        />
        <TouchableHighlight onPress={this.handleVerifyLogin}>
          <Text>
            {this.state.button_text}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
})

module.exports = LoginPage