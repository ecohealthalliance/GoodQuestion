import React, {
  Alert,
  View,
  Text,
  Linking,
} from 'react-native';
import Styles from '../styles/Styles';
import ControlPanelItem from '../components/ControlPanelItem';
import { version } from '../../package';

export default React.createClass({
  componentWillMount() {
    this.navigating = false;
    this.nextPath = '';
    this.nextTitle = '';
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
            onPress={() => this.navigateToView('profile', 'Profile')}
            text='Profile'
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
            text='Logout'
          />
        </View>
        <View style={Styles.controlPanel.footer}>
            <Text>Version: {version || 'None'}</Text>
        </View>
      </View>
    );
  },
});
