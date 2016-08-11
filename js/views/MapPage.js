import React from 'react';
import {
  StyleSheet,
  Platform,
  View,
  InteractionManager,
} from 'react-native';
import _ from 'lodash';

import Styles from '../styles/Styles';
import MapView from 'react-native-maps';

import { loadCachedGeofenceTriggers } from '../api/Triggers';
import { loadCachedFormDataByTriggerId } from '../api/Forms';
import { setActiveMap, clearActiveMap, getUserLocationData } from '../api/Geofencing';

import Loading from '../components/Loading';


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
});

const MapPage = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    survey: React.PropTypes.object,
  },

  getInitialState() {
    return {
      stage: 'loading',
      updates: 0,
      latitude: 40.782786,
      longitude: -73.965850,
      zoom: 0.01,
      markers: [],
      triggers: [],
    };
  },

  componentDidMount() {
    loadCachedGeofenceTriggers({
      surveyId: this.props.survey ? this.props.survey.id : false,
      excludeCompleted: true,
    }, (err, response) => {
      setActiveMap(this);
      this.active = true;
      this.generateTriggerMarkers(response);

      getUserLocationData((location) => {
        InteractionManager.runAfterInteractions(() => {
          if (!this.cancelCallbacks) {
            this.setState({
              latitude: location.latitude || 40.782786,
              longitude: location.longitude || -73.965850,
              stage: 'ready',
            });
          }
        });
      });

    });
  },

  componentWillUnmount() {
    clearActiveMap(this);
    this.active = false;
    this.cancelCallbacks = true;
  },

  /* Methods */
  generateTriggerMarkers(triggers) {
    this.wipeMarkers();
    const geoTriggers = triggers || this.state.triggers;

    let markers = [];
    markers = geoTriggers.map((trigger) => {
      return {
        id: trigger.id,
        title: trigger.title,
        description: trigger.description,
        position: {
          latitude: trigger.latitude,
          longitude: trigger.longitude,
        },
        radius: trigger.radius,
        active: trigger.inRange,
      };
    });

    this.setState({
      triggers: geoTriggers,
      markers: markers,
    });
  },

  updateMarkers(geofence) {
    if (_.lowerCase(geofence.action) === 'enter' || _.lowerCase(geofence.action) === 'dwell') {
      const updatedMarkers = this.state.markers.filter((marker) => {
        return marker.id === geofence.identifier;
      });
      for (let i = 0; i < updatedMarkers.length; i++) {
        updatedMarkers[i].active = true;
      }
    } else if (_.lowerCase(geofence.action) === 'exit') {
      const updatedMarkers = this.state.markers.filter((marker) => {
        return marker.id === geofence.identifier;
      });
      for (let i = 0; i < updatedMarkers.length; i++) {
        updatedMarkers[i].active = false;
      }
    }

    this.setState({updated: this.state.updated + 1});
  },

  wipeMarkers() {
    this.setState({markers: []});
  },

  handleMarkerPress(marker) {
    const data = loadCachedFormDataByTriggerId(marker.id, 'geofence');

    if (marker.active) {
      this.props.navigator.push({
        path: 'form',
        title: data.survey.title,
        survey: data.survey,
        form: data.form,
        type: 'geofence',
      });
    }
  },

  /* Render */
  render() {
    if (this.state.stage === 'loading') {
      return <Loading/>;
    }

    return (
      <View style={[Styles.container.default, { flex: 1, overflow: 'hidden' }]}>
        <MapView
          ref={(ref) => {
            this._map = ref;
          }}
          key='gmap'
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
            this.state.markers.map((marker) => {
              return (
                <MapView.Circle
                  key={`circle- + ${marker.id}`}
                  center={marker.position}
                  radius={marker.radius}
                  strokeColor='#700'
                  fillColor={marker.active ? 'rgba(30, 150, 30, 0.5)' : 'rgba(100, 30, 30, 0.5)'}
                />
              );
            })
          }
          {
            this.state.markers.map((marker) => {
              return (
                <MapView.Marker
                  // Android
                  onPress={this.handleMarkerPress.bind(null, marker)}
                  // iOS
                  onSelect={this.handleMarkerPress.bind(null, marker)}
                  key={`marker- + ${marker.id}`}
                  coordinate={marker.position}
                  title={marker.title}
                  description={marker.description}
                />
              );
            })
          }
        </MapView>
      </View>
    );
  },
});

module.exports = MapPage;
