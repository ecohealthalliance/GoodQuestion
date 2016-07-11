import React from 'react';
import { View, Text } from 'react-native';

//import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundGeolocation from 'react-native-background-geolocation-android';

import Settings from './js/settings';

BackgroundGeolocation.configure({
  // License validations
  orderId: Settings.licenses.BackgroundGeolocation.bundleId,
  license: Settings.licenses.BackgroundGeolocation.key,

  // Geolocation config
  desiredAccuracy: 10,
  distanceFilter: 50,
  locationUpdateInterval: 5000,
  fastestLocationUpdateInterval: 5000,

  // Activity Recognition config
  minimumActivityRecognitionConfidence: 80,
  activityRecognitionInterval: 10000,
  stopDetectionDelay: 1,
  stopTimeout: 2,

  // Application config
  debug: true,
  forceReloadOnLocationChange: false,  // Android
  forceReloadOnMotionChange: false,    // Android
  forceReloadOnGeofence: false,        // Android
  stopOnTerminate: false,              // Android
  startOnBoot: true,

  useSignificantChangesOnly: false, // iOS
  disableMotionActivityUpdates: false, // iOS
});

const App = React.createClass({
  getInitialState() {
    const self = this;

    const myGeofences = [{
      identifier: 'geo1',
      latitude: 37.330235,
      longitude: -122.027286,
      radius: 120,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 15000
    }, {
      identifier: 'geo2',
      latitude: 37.337580,
      longitude: -122.023220,
      radius: 150,
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyOnDwell: true,
      loiteringDelay: 15000
    }];

    BackgroundGeolocation.on('geofence', function(params) {
      console.log('geofence crossed!');
      console.log(params);
      self.setState({text: JSON.stringify(params)});
    });

    BackgroundGeolocation.start(function() {
      console.log('- [js] BackgroundGeolocation started successfully');

      BackgroundGeolocation.addGeofences(myGeofences, function() {
        console.log("Successfully added geofences.");
      }, function(error) {
        console.warn("Failed to add geofences.", error);
      });

    });

    setTimeout(() => {
      BackgroundGeolocation.getGeofences((geofences)=>{
        console.log("getGeofences: ", geofences);
      });
    }, 5000);

    return { text: ''};
  },

  render() {
    return (
      <View>
        <Text> Geofence Test </Text>
        <Text> {this.state.text} </Text>
      </View>
    );
  }
});

module.exports = App;
