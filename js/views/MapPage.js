// A placeholder view for integrating native navigation

import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native'

import Button from '../components/Button'
import TermsOfService from '../data/TermsOfService'
import Styles from '../styles/Styles'
import MapView from 'react-native-maps'


const TermsOfServicePage = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    this.markers = []
    return {
      latitude: 40.768169,
      longitude: -73.981190,
      zoom: 0.01,
      markers: []
    }
  },

  componentDidMount() {
    this.generateTriggerMarkers()
  },

  /* Methods */
  generateTriggerMarkers() {
    this.wipeMarkers()
    let markers = []

    if (this.props.geotriggers) {
      markers = this.props.geotriggers.map((trigger, index) => {
        return {
          title: trigger.title,
          description: trigger.description,
          position: {
            latitude: trigger.latitude,
            longitude: trigger.longitude,
          }
        }
      })
    }

    // generate some dummy markers for testing
    markers = [
      { title: 'marker 1', description: 'geofence survey', position: {latitude: 40.767721, longitude: -73.980388} },
      { title: 'marker 2', description: 'geofence survey', position: {latitude: 40.767954, longitude: -73.982363} },
      { title: 'marker 3', description: 'geofence survey', position: {latitude: 40.768523, longitude: -73.981048} },
    ]
    this.setState({
      markers: markers
    })
  },

  wipeMarkers() {
    this.setState({markers: []})
  },

  /* Render */
  render() {
    return (
      <View style={[Styles.container.default , {flex: 1, overflow: 'hidden'}]}>
        <MapView
          ref={(ref) => this._map = ref}
          style={{flex: 1}}
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
              <MapView.Marker
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

module.exports = TermsOfServicePage
