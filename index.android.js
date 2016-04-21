/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
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
      text: 'Email?'
    }
  },

  /* Methods */
  handleVerifyEmail() {

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
          />
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
