
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

import Styles from '../../styles/Styles'


const LoginPage = React.createClass ({

  /* Methods */

  /* Render */
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Enter your email
        </Text>
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
  heading: {
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