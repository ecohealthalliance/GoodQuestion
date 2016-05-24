
import React, {View, Text, Linking} from 'react-native'

import {logout} from '../api/Account'
import Styles from '../styles/Styles'
import Store from '../data/Store'
import ControlPanelItem from '../components/ControlPanelItem'
import { version } from '../../package'

export default React.createClass({
  navigateToView(viewPath, title) {
    console.log(this.props)
    let props = this.props
    let navigator = Store.navigator
    console.log(navigator)
    let routeStack = navigator.getCurrentRoutes()
    let currentRoutePath = routeStack[routeStack.length-1].path
    if (viewPath !== currentRoutePath) {
      navigator.push({path: viewPath, title: title})
    }
    props.closeDrawer()
  },
  render() {

    return (
      <View style={Styles.controlPanel.container}>
        <View style={Styles.controlPanel.itemList}>
          <ControlPanelItem
            onPress={()=>{
              this.props.closeDrawer();
              this.props.logout();
            }}
            text="Logout"
          />
          <ControlPanelItem
            onPress={()=> this.navigateToView('surveylist', 'Surveys')}
            text="Surveys"
          />
          <ControlPanelItem
            onPress={()=> this.navigateToView('notifications', 'Notifications')}
            text="Notifications"
          />
          <ControlPanelItem
            onPress={()=> this.navigateToView('profile', 'Profile')}
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
        </View>
        <View style={Styles.controlPanel.footer}>
            <Text>Version: {version || "None"}</Text>
        </View>
      </View>
    )
  }
})
