// A placeholder view for integrating native navigation

import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  Platform,
  View,
} from 'react-native'

import Button from '../components/Button'
import TermsOfService from '../data/TermsOfService'
import Styles from '../styles/Styles'
import MapView from 'react-native-maps'

import { loadAllCachedGeofenceTriggers } from '../api/Triggers'
import { BackgroundGeolocation } from '../api/BackgroundProcess'
import { setActiveMap, clearActiveMap } from '../api/GeoFencing'


const TermsOfServicePage = React.createClass ({
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
      latitude: 28.46986,
      longitude: -81.58495,
      zoom: 0.01,
      markers: [],
      triggers: triggers,
    }
  },

  componentDidMount() {
    this.generateTriggerMarkers()
    setActiveMap(this)
    this.active = true
  },

  /* Methods */
  generateTriggerMarkers() {
    this.wipeMarkers()
    let markers = []

    markers = this.state.triggers.map((trigger, index) => {
      return {
        title: trigger.title,
        description: trigger.description,
        position: {
          latitude: trigger.latitude,
          longitude: trigger.longitude,
        },
        radius: trigger.radius
      }
    })

    this.setState({
      markers: markers
    })
  },

  updateMarkers(geofence) {
    console.log("- A Geofence transition occurred")
    console.log("  geofence: ", geofence)
    console.log("  identifier: ", geofence.identifier)
    console.log("  action: ", geofence.action)
  },

  wipeMarkers() {
    this.setState({markers: []})
  },

  componentWillUnmount() {
    clearActiveMap(this)
    this.active = false
  },

  /* Render */
  render() {
    const containerStyle = []
    const mapStyle = []


    return (
      <View style={[Styles.container.default, { flex: 1, overflow: 'hidden' }]}>
        <MapView
          ref={(ref) => this._map = ref}
          style={Platform.OS === 'ios' ? _styles.iosMap : _styles.androidMap}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.zoom,
            longitudeDelta: this.state.zoom * 0.5,
          }}
          mapType={'standard'}
          showsUserLocation={true}
          followsUserLocation={true}
          showsPointsOfInterest={false}
          showsCompass={true}
        > 
          {
            this.state.markers.map(marker => (
              <MapView.Circle
                key={'circle-'+marker.title}
                center={marker.position}
                radius={marker.radius}
                strokeColor='#700'
                fillColor='rgba(100, 30, 30, 0.5)'
              />
            ))
          }
          {
            this.state.markers.map(marker => (
              <MapView.Marker
                key={'marker-'+marker.title}
                coordinate={marker.position}
                title={marker.title}
                description={marker.description}
              />
            ))
          }
        </MapView>
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

module.exports = TermsOfServicePage
