
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  Alert,
  Image,
} from 'react-native'

import Styles from '../styles/Styles'
import {currentUser} from '../api/Account'

const ProfilePage = React.createClass ({
  currentUser: null,

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      email: null,
      name: null,
      phone: null,
    }
  },

  componentWillMount() {
    currentUser((err, user) => {
      if (err) {
        Alert.alert('Please Login');
        this.props.navigator.resetTo({path:'login', title:''});
        return;
      }
      this.currentUser = user;
      this.setState({
        email: user.get('username'),
        name: user.get('name'),
        phone: user.get('phone'),
      });
    });
  },
  /* Methods */

  /* Render */
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={Styles.profile.header}>
          <Image source={require('../images/profile_logo.png')} style={Styles.profile.picture}></Image>
          <Text style={Styles.profile.name}> {this.state.name} </Text>
          <Text style={Styles.profile.phone}> {this.state.phone} </Text>
        </View>
        <Text style={[Styles.type.h1, {textAlign: 'center'}]}> Update your Profile </Text>

      </View>
    )
  }
})

module.exports = ProfilePage
