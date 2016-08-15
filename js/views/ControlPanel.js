import React from 'react';
import {
  Alert,
  View,
  Text,
  Linking,
  Image,
} from 'react-native';

import pubsub from 'pubsub-js';
import {ProfileAddresses, ProfileMessage} from '../models/messages/ProfileMessage';

import {getAvatarImage} from '../api/Account';
import Styles from '../styles/Styles';
import ControlPanelItem from '../components/ControlPanelItem';
import { version } from '../../package';

const defaultAvatar = require('../images/profile_logo.png');

export default React.createClass({
  getInitialState() {
    // subscribe to the pubsub channel and handle valid requests
    pubsub.subscribe(ProfileAddresses.CHANGE, (address, request) => {
      console.log('controlPanel.pubsub.request: ', request);
      if (request instanceof ProfileMessage) {
        this.setState(request);
      }
    });

    return {
      avatar: defaultAvatar,
      username: null,
    };
  },

  componentWillMount() {
    this.navigating = false;
    this.nextPath = '';
    this.nextTitle = '';
  },

  componentDidMount() {
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
        avatar: avatar,
        username: result.user.get('username'),
      });
    });
  },

  navigateToView(path, title) {
    this.navigating = true;
    this.nextPath = path;
    this.nextTitle = title;
    // this.props.changeRoute()
    this.props.closeDrawer();
  },

  handleLogout() {
    this.navigating = false;
    Alert.alert(
      'Logout',
      'Are you sure you\'d like to sign out?',
      [
        {text: 'Cancel', onPress: () => {
          console.log('Logout Canceled');
        }, style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.props.closeDrawer();
          this.props.logout();
        }},
      ]
    );
  },

  render() {
    return (
      <View style={Styles.controlPanel.container}>
        <View style={Styles.controlPanel.itemList}>
          <ControlPanelItem
            onPress={() => this.navigateToView('surveylist', 'Surveys')}
            text='Surveys'
          />
          <ControlPanelItem
            onPress={() => this.navigateToView('notifications', 'Notifications')}
            text='Notifications'
          />
          <ControlPanelItem
            onPress={() => this.navigateToView('map', 'Map')}
            text='Map'
          />
          <ControlPanelItem
            onPress={() => this.navigateToView('calendar', 'Calendar')}
            text='Calendar'
          />
          <ControlPanelItem
            onPress={() => this.navigateToView('profile', 'Profile')}
            text='Profile'
            icon={<View style={Styles.controlPanel.iconView}><Image source={this.state.avatar} style={Styles.controlPanel.avatar}/></View>}
          />
          <ControlPanelItem
            onPress={() => {
              // mailto links do not work in the ios simulator.
              // https://github.com/facebook/react-native/issues/916
              // TODO: Set up support mailing list
              const url = 'mailto:goodquestion@ecohealthalliance.org?subject=Support';
              Linking.openURL(url).catch((err) => {
                  console.error('An error occurred', err);
                });
              this.props.closeDrawer();
            }}
            text='Support'
          />
          <ControlPanelItem
            onPress={this.handleLogout}
            style={{borderBottomWidth: 0}}
            text='Logout'
          />
        </View>
        <View style={Styles.controlPanel.footer}>
          <Text>User: {this.state.username}</Text>
          <Text>Version: {version || 'None'}</Text>
        </View>
      </View>
    );
  },
});
