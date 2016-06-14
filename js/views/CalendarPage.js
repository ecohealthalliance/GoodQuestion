import React, {
  StyleSheet,
  Text,
  Platform,
  View,
} from 'react-native'

import Styles from '../styles/Styles'
import MapView from 'react-native-maps'

import { loadAllCachedGeofenceTriggers } from '../api/Triggers'
import { loadCachedFormDataByGeofence } from '../api/Forms'
import { BackgroundGeolocation } from '../api/BackgroundProcess'
import { setActiveMap, clearActiveMap, getUserLocationData } from '../api/Geofencing'


const CalendarPage = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    triggers: React.PropTypes.object
  },

  getInitialState() {
    let triggers = this.props.triggers
    // Load all triggers if none were provided via props
    if (!triggers) {
      triggers = loadAllCachedGeofenceTriggers()
    }
    this.markers = []
    return {
      updates: 0,
      latitude: 28.46986,
      longitude: -81.58495,
      zoom: 0.01,
      markers: [],
      triggers: triggers,
    }
  },

  componentDidMount() {
  },

  componentWillUnmount() {
  },

  /* Methods */
  

  /* Render */
  render() {
    return (
      <View style={[Styles.container.default, { flex: 1, overflow: 'hidden' }]}>
        
      </View>
    )
  }
})

const _styles = StyleSheet.create({
  iosMap: {
    flex: 1,
  },
  androidMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

module.exports = CalendarPage
