
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

import { verifyEmail } from '../api/Email'


const EmailView = React.createClass ({
  
  getInitialState() {
    return {
      text: '',
      click_text: 'Verify',
    }
  },

  /* Methods */
  handleVerifyEmail(event) {
    event.preventDefault()

    this.setState({
      click_text: 'Verifying...'
    })

    verifyEmail(this.state.text, this.handleVerifyEmailResponse)
  },

  handleVerifyEmailResponse(response) {
    this.setState({
      click_text: 'Email Verified'
    })
  },

  /* Render */
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Enter your email
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 20}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          placeholder="enter your email"
        />
        <TouchableHighlight onPress={this.handleVerifyEmail}>
          <Text style={styles.welcome}>
            {this.state.click_text}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

module.exports = EmailView