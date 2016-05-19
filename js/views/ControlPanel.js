
import React, {View, Text, Linking} from 'react-native'

import {logout} from '../api/Account'
import Styles from '../styles/Styles'
import ControlPanelItem from '../components/ControlPanelItem'
import Settings from '../settings'

export default React.createClass({
  render() {
    return (
      <View style={Styles.controlPanel.container}>
        <ControlPanelItem
          onPress={()=>{
            this.props.closeDrawer();
            this.props.logout();
          }}
          text="Logout"
        />
        <ControlPanelItem
          onPress={()=>{
            this.props.navigator.push({path: 'surveylist', title: 'Surveys'});
            this.props.closeDrawer();
          }}
          text="Surveys"
        />
        <ControlPanelItem
          text="Notifications"
        />
        <ControlPanelItem
          onPress={()=>{
            this.props.navigator.push({'path': 'profile', title: 'Profile'});
            this.props.closeDrawer();
          }}
          text="Profile"
        />
        <ControlPanelItem
          onPress={()=>{
            // mailto links do not work in the ios simulator.
            // https://github.com/facebook/react-native/issues/916
            // TODO: Set up support mailing list
            Linking.openURL("mailto:goodquestion@ecohealthalliance.org?subject=Support")
              .catch(err => console.error('An error occurred', err))
            this.props.closeDrawer()
          }}
          text="Support"
        />
        <View style={Styles.controlPanel.item}>
            <Text>Version: {Settings.version || "None"}</Text>
        </View>
      </View>
    )
  }
})
