/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

import { Provider } from 'react-redux'
import configureStore from './js/store/configureStore'

const store = configureStore()

const GoodQuestion = React.createClass ({
  getInitialState() {
    return {
      text: '',
      click_text: 'Verify',
    }
  },

  /* Methods */
  handleVerifyEmail(event) {
    event.preventDefault();

    this.setState({
      click_text: 'Email Verified'
    })
  },

  /* Render */
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            A React Native test !
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
      </Provider>
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
  button: {
    textAlign: 'center',
    color: '#3333DD',
    marginBottom: 5,
  },
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
