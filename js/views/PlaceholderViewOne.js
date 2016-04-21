// A placeholder view for integrating native navigation

import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

import { verifyEmail } from '../api/Email'


const PlaceholderViewOne = React.createClass ({
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          View 1
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
})

module.exports = PlaceholderViewOne