
import React, {
  Text,
  TextInput,
  View,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'


const RegistrationPagePart4 = React.createClass ({
  getInitialState() {
    return {
      nameInput: '',
      phoneInput: '',
      extraInput: '',
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
          onChangeText={(nameInput) => this.setState({nameInput})}
          value={this.state.nameInput}
          placeholder="Full Name"
        />
        <TextInput
          style={Styles.form.inputWide}
          onChangeText={(phoneInput) => this.setState({phoneInput})}
          value={this.state.phoneInput}
          placeholder="Phone Number"
        />
        {/* Extra unknown field from the mock-ups */}
        <TextInput
          style={Styles.form.inputWide}
          onChangeText={(extraInput) => this.setState({extraInput})}
          value={this.state.extraInput}
          placeholder="Another field ?"
        />
      </View>
    )
  }
})

module.exports = RegistrationPagePart4