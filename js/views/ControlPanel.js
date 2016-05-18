
import React, {View, Text, Linking} from 'react-native'

import async from 'async'

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
            logout();
            async.nextTick(() => {
              this.props.closeDrawer();
              this.props.navigator.resetTo({path:'login',title:' '});
            });
          }}
          text="Logout"
        />
        <ControlPanelItem
          onPress={()=>{
            this.props.navigator.push({name: 'surveylist'})
            this.props.closeDrawer()
          }}
          text="Surveys"
        />
        <ControlPanelItem
          text="Notifications"
        />
        <ControlPanelItem
          text="Profile"
        />
        <ControlPanelItem
          text="Account"
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
