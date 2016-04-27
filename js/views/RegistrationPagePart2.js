
import React, {
  Text,
  TextInput,
  View,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'


const RegistrationPagePart2 = React.createClass ({
  getInitialState() {
    return {
      passwordInput: '',
      secondPasswordInput: '',
    }
  },

  /* Methods */

  /* Render */
  render() {
    return (
      <View style={Styles.container.compact}>
        <Text style={Styles.type.h1}>
          Create Password
        </Text>
        <TextInput
          style={Styles.form.inputWide}
          onChangeText={(passwordInput) => this.setState({passwordInput})}
          value={this.state.passwordInput}
          placeholder="Password"
        />
        <TextInput
          style={Styles.form.inputWide}
          onChangeText={(secondPasswordInput) => this.setState({secondPasswordInput})}
          value={this.state.secondPasswordInput}
          placeholder="Confirm Password"
        />
      </View>
    )
  }
})

module.exports = RegistrationPagePart2