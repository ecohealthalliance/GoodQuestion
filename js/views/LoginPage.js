
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


const LoginPage = React.createClass ({
  getInitialState() {
    return {
      emailInput: '',
      passwordInput: '',
    }
  },

  /* Methods */

  /* Render */
  render() {
    return (
      <View style={Styles.container.default}>
        <TextInput
          style={styles.input}
          onChangeText={(emailInput) => this.setState({emailInput})}
          value={this.state.emailInput}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={(passwordInput) => this.setState({passwordInput})}
          value={this.state.passwordInput}
          placeholder="Password"
        />
        <TouchableOpacity
          onPress={() => navigator.push(next_route)}
          style={styles.navBarRightButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.background2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
  }
})

module.exports = LoginPage