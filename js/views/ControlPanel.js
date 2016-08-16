import React from 'react';
import {
  Alert,
  View,
  Text,
  Linking,
  Image,
} from 'react-native';

import pubsub from 'pubsub-js';
import Store from '../data/Store';
import Styles from '../styles/Styles';

import { ProfileAddresses, ProfileMessage } from '../models/messages/ProfileMessage';
import { getAvatarImage } from '../api/Account';
import { loadNotifications } from '../api/Notifications';
import { version } from '../../package';

import ControlPanelItem from '../components/ControlPanelItem';

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

  getInitialState() {
    return {
      notificationCount: Store.newNotifications,
    };
  },

  componentDidMount() {
    pubsub.subscribe('onNotification', () => {
      this.updateNotifications();
    });

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

  /* Methods */
  navigateToView(path, title) {
    this.navigating = true;
    this.nextPath = path;
    this.nextTitle = title;
    this.props.closeDrawer();
  },

  navigateToNotificationsView() {
    Store.newNotifications = 0;
    this.setState({
      notificationCount: 0,
    }, () => {
      this.navigateToView('notifications', 'Notifications');
    });
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

  updateNotifications() {
    const notifications = loadNotifications();
    let count = notifications.length;
    if (count > 99) {
      count = 99;
    }
    this.setState({notificationCount: count});
  },

  /* Render */
  render() {
    return (
      <View style={Styles.controlPanel.container}>
        <View style={Styles.controlPanel.itemList}>
          <ControlPanelItem
            onPress={() => this.navigateToView('surveylist', 'Surveys')}
            text='Surveys'
          />
          <ControlPanelItem
            onPress={this.navigateToNotificationsView}
            text='Notifications'
            counter={this.state.notificationCount}
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
