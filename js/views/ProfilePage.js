import React from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import ProfileItem from '../components/ProfileItem';

import {updateInformation, updatePassword, getAvatarImage, changeAvatarImage} from '../api/Account';

import Button from '../components/Button';
import Loading from '../components/Loading';

import Joi from '../lib/joi-browser.min';
import JoiMixins from '../mixins/joi-mixins';
import EventMixins from '../mixins/event-mixins';


const defaultAvatar = require('../images/profile_logo.png');

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
    currentPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('Current Password'),
    newPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('New Password'),
    confirmNewPassword: Joi.string().regex(/^([a-zA-Z0-9@*#]{8,15})$/).required().options(
      {language: {string: {regex: {base: 'must be between 8 and 15 alphanumeric characters'}}}}).label('Confirm New Password'),
  },

  getInitialState() {
    return {
      isLoading: true,
      buttonText: 'Save',
      email: null,
      name: null,
      phone: null,
      currentPassword: null,
      newPassword: null,
      confirmNewPassword: null,
      avatar: defaultAvatar,
      errors: [],
    };
  },

  componentWillMount() {
    getAvatarImage((err, result) => {
      if (err) {
        if (err && err === 'Invalid User') {
          Alert.alert('Please Login');
          this.props.navigator.resetTo({path: 'login', title: ''});
          return;
        }
        this.setState({isLoading: false});
        console.warn(err);
        return;
      }
      const avatar = result.source;
      this.setState({
        isLoading: false,
        avatar: avatar,
        email: result.user.get('username'),
        name: result.user.get('name'),
        phone: result.user.get('phone'),
      });
    });
  },

  updateInformation() {
    this.setState({buttonText: 'Saving...'});
    const ignore = ['currentPassword', 'newPassword', 'confirmNewPassword'];
    const errors = this.joiValidate(ignore);
    if (Object.keys(errors).length > 0) {
      Alert.alert('Error', 'Fix the form errors before saving.');
      this.setState({errors: errors});
      return;
    }

    updateInformation(this.state.name, this.state.phone, (err) => {
      this.setState({buttonText: 'Submit'});
      if (err) {
        Alert.alert('Error', 'There was an error saving.');
        return;
      }
      Alert.alert('Success', 'Your profile has been updated.');
    });
  },

  confirmNewPasswordHandler(name, value) {
    const password = this.state.newPassword;
    const errors = Object.assign({}, this.state.errors);
    const state = {
      errors: errors,
    };
    if (password !== value) {
      state.errors[name] = '"Confirm New Password" does not match new password';
      state[name] = value;
      this.setState(state);
      return;
    }
    // continue with mixin handler
    this.textFieldChangeHandler(name, value);
  },

  updatePassword() {
    this.setState({buttonText: 'Saving...'});
    const ignore = ['name', 'phone'];
    const errors = this.joiValidate(ignore);
    if (Object.keys(errors).length > 0) {
      Alert.alert('Error', 'Fix the form errors before saving.');
      this.setState({errors: errors});
      return;
    }
    updatePassword(this.state.currentPassword, this.state.newPassword, (err) => {
      this.setState({
        buttonText: 'Submit',
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null,
      });
      if (err) {
        if (err.hasOwnProperty('logout') && err.logout) {
          // A special error object with property logout should force the user
          // to logout
          Alert.alert('Error', err.message);
          this.props.logout();
          return;
        }
        Alert.alert('Error', err);
        return;
      }
      Alert.alert('Success', 'Please login with your new password.');
      // The users session is invalidated upon changing their password and
      // they must re-authenticate at the login screen
      this.props.logout();
    });
  },

  renderYourInformation() {
    return (
      <View>
        <View style={Styles.form.inputGroup}>
          <Text style={Styles.form.errorText}>
            {this.decodeText(this.state.errors.name)}
          </Text>
          <View ref='nameView'>
            <TextInput
              ref='name'
              style={Styles.form.input}
              onChangeText={this.textFieldChangeHandler.bind(this, 'name')}
              onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'nameView')}
              onBlur={this.trimText.bind(this, 'name')}
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
              onChangeText={this.textFieldChangeHandler.bind(this, 'phone')}
              onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'phoneView')}
              onBlur={this.trimText.bind(this, 'phone')}
              value={this.state.phone}
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              placeholder='Phone Number'
            />
          </View>
        </View>
        <View style={Styles.form.bottomForm}>
          <Button action={this.updateInformation} color='primary' wide>
            {this.state.buttonText}
          </Button>
        </View>
      </View>
    );
  },

  renderChangePassword() {
    return (
      <View>
        <View style={Styles.form.inputGroup}>
          <Text style={Styles.form.errorText}>
            {this.decodeText(this.state.errors.currentPassword)}
          </Text>
          <View ref='currentPasswordView'>
            <TextInput
              ref='currentPassword'
              style={Styles.form.input}
              secureTextEntry={true}
              onChangeText={this.textFieldChangeHandler.bind(this, 'currentPassword')}
              onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'currentPasswordView')}
              onBlur={this.trimText.bind(this, 'currentPassword')}
              value={this.state.currentPassword}
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              placeholder='Current Password'
            />
          </View>
          <Text style={Styles.form.errorText}>
            {this.decodeText(this.state.errors.newPassword)}
          </Text>
          <View ref='newPasswordView'>
            <TextInput
              ref='newPassword'
              style={Styles.form.input}
              secureTextEntry={true}
              onChangeText={this.textFieldChangeHandler.bind(this, 'newPassword')}
              onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'newPasswordView')}
              onBlur={this.trimText.bind(this, 'newPassword')}
              value={this.state.newPassword}
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              placeholder='New Password'
            />
          </View>
          <Text style={Styles.form.errorText}>
            {this.decodeText(this.state.errors.confirmNewPassword)}
          </Text>
          <View ref='confirmNewPasswordView'>
            <TextInput
              ref='confirmNewPassword'
              style={Styles.form.input}
              secureTextEntry={true}
              onChangeText={this.confirmNewPasswordHandler.bind(this, 'confirmNewPassword')}
              onFocus={this.scrollToViewWrapper.bind(this, 'scrollView', 'confirmNewPasswordView')}
              onBlur={this.trimText.bind(this, 'confirmNewPassword')}
              value={this.state.confirmNewPassword}
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              placeholder='Confirm New Password'
            />
          </View>
        </View>
        <View style={Styles.form.bottomForm}>
          <Button action={this.updatePassword} color='primary' wide>
            {this.state.buttonText}
          </Button>
        </View>
      </View>
    );
  },

  handleImagePicker() {
    changeAvatarImage(this, (err, result) => {
      if (err) {
        this.setState({isLoading: false});
        if (err === 'Canceled') {
          return;
        }
        Alert.alert('Error', 'There was an error saving the image.');
        return console.warn(err);
      }
      const avatar = {uri: result.save};
      this.setState({
        isLoading: false,
        avatar: avatar,
      });
    });
  },

  /* Render */
  render() {
    let loading = null;
    if (this.state.isLoading) {
      loading = <Loading style={Styles.profile.loading} size={60} />;
    }
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView ref='scrollView' horizontal={false} style={{flex: 1, backgroundColor: '#fff'}} >
          <View style={Styles.profile.header}>
            <View style={Styles.profile.avatarView}>
              <View style={{borderRadius: 90, borderWidth: 2, borderColor: '#fff'}}>
                <Image source={this.state.avatar} style={Styles.profile.picture} >
                  {loading}
                </Image>
              </View>
              <TouchableHighlight onPress={this.handleImagePicker} underlayColor='#C4F5FF' style={Styles.profile.avatarTouchable}>
                <View style={Styles.profile.changeProfileImageView}>
                  <Icon name='camera' size={28} color={Color.primary} />
                </View>
              </TouchableHighlight>
            </View>
            <View style={Styles.profile.basicInfoView} >
              <Text style={Styles.profile.name}> {this.state.name} </Text>
              <Text style={Styles.profile.phone}> {this.state.phone} </Text>
            </View>
          </View>
          <View>
            <View style={Styles.profile.itemList}>
              <ProfileItem
                text='Your Information'
                icon={<View style={Styles.profile.iconView}><Icon name='user' size={28} color={Color.primary} /></View>}
                collapsed={true}>
                {this.renderYourInformation()}
              </ProfileItem>
              <ProfileItem
                text='Change Password'
                icon={<View style={Styles.profile.iconView}><Icon name='key' size={28} color={Color.primary} /></View>}
                collapsed={true}>
                {this.renderChangePassword()}
              </ProfileItem>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  },
});

module.exports = ProfilePage;
