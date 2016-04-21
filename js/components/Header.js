import React, {
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native'

import { verifyEmail } from '../api/Email'


const Header = React.createClass ({
  
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
        <Text style={styles.heading}>
          Enter your email
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 20}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          placeholder="enter your email"
        />
        <TouchableHighlight onPress={this.handleVerifyEmail}>
          <Text style={styles.heading}>
            {this.state.click_text}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
})

module.exports = Header