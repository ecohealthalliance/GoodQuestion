import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import Styles from '../styles/Styles';
import {currentUser, updateProfile} from '../api/Account';

import Button from '../components/Button';

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';

const logo = require('../images/profile_logo.png');

const ProfilePage = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  mixins: [
    JoiMixins,
    EventMixins,
  ],

  schema: {
    name: Joi.string().min(3).required().options({language: {any: {allowOnly: 'must not be empty'}}}).label('Full Name'),
    phone: Joi.string().optional().label('Phone Number'),
  },

  getInitialState() {
    return {
      buttonText: 'Submit',
      email: null,
      name: null,
      phone: null,
      errors: [],
    };
  },

  componentWillMount() {
    currentUser((err, user) => {
      if (err) {
        Alert.alert('Please Login');
        this.props.navigator.resetTo({path: 'login', title: ''});
        return;
      }
      this.setState({
        email: user.get('username'),
        name: user.get('name'),
        phone: user.get('phone'),
      });
    });
  },

  submit() {
    this.setState({buttonText: 'Updating...'});
    updateProfile(this.state.name, this.state.phone, (err) => {
      this.setState({buttonText: 'Submit'});
      if (err) {
        Alert.alert('Error', 'There was an error saving.');
        return;
      }
      Alert.alert('Success', 'Your profile has been updated.');
    });
  },

  /* Render */
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView ref='scrollView' horizontal={false}>
          <View style={Styles.profile.header}>
            <Image source={logo} style={Styles.profile.picture}></Image>
            <Text style={Styles.profile.name}> {this.state.name} </Text>
            <Text style={Styles.profile.phone}> {this.state.phone} </Text>
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <Text style={[Styles.type.h1, {textAlign: 'center'}]}>
              Update your Profile
            </Text>
            <View style={Styles.form.inputGroup}>
              <Text style={Styles.form.errorText}>
                {this.decodeText(this.state.errors.name)}
              </Text>
              <View ref='nameView'>
                <TextInput
                  ref='name'
                  style={Styles.form.input}
                  onChangeText={this.textFieldChangeHandler.bind(null, 'name')}
                  onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'nameView')}
                  onBlur={this.trimText.bind(null, 'name')}
                  value={this.state.name}
                  autoCapitalize='none'
                  autoCorrect={false}
                  returnKeyType='done'
                  placeholder='Full Name'
                />
              </View>
              <Text style={Styles.form.errorText}>
                {this.decodeText(this.state.errors.phone)}
              </Text>
              <View ref='phoneView'>
                <TextInput
                  ref='phone'
                  style={Styles.form.input}
                  onChangeText={this.textFieldChangeHandler.bind(null, 'phone')}
                  onFocus={this.scrollToViewWrapper.bind(null, 'scrollView', 'phoneView')}
                  onBlur={this.trimText.bind(null, 'phone')}
                  value={this.state.phone}
                  autoCapitalize='none'
                  autoCorrect={false}
                  returnKeyType='done'
                  placeholder='Phone Number'
                />
              </View>
            </View>
            <View style={Styles.form.bottomForm}>
              <Button action={this.submit} color='primary' wide>
                {this.state.buttonText}
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  },
});

module.exports = ProfilePage;
