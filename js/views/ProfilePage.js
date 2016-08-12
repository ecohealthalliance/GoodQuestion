import React, {
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
import {updateProfile, getAvatarImage, changeAvatarImage} from '../api/Account';

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
  },

  getInitialState() {
    return {
      isLoading: true,
      buttonText: 'Submit',
      email: null,
      name: null,
      phone: null,
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
        <ScrollView ref='scrollView' horizontal={false}>
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
