import { Platform } from 'react-native'
import Settings from '../settings'

import { addSchedule } from './Schedule'
import { checkTimeTriggers } from './Triggers'
import { setupGeofences } from './Geofencing'

export const BackgroundGeolocation = Platform.OS === 'ios' ?
                                      require('react-native-background-geolocation') :
                                      require('react-native-background-geolocation-android')

let startTimer = Date.now()

export function configureGeolocationService(options = {}, callback) {
  try {
    console.log('Configuring Geolocation: ' + options.energySaving ? 'Energy Saving Mode' : 'High Accuracy Mode');
    let config;

    if (options.energySaving) {
      // Energy Saving Mode
      config = {
        // License validations
        orderId: Settings.licenses.BackgroundGeolocation.bundleId,
        license: Settings.licenses.BackgroundGeolocation.key,

        // Geolocation config
        desiredAccuracy: 100,
        distanceFilter: 80,
        locationUpdateInterval: 30000,
        fastestLocationUpdateInterval: 30000,

        // Activity Recognition config
        minimumActivityRecognitionConfidence: 80,
        activityRecognitionInterval: 45000,
        stopDetectionDelay: 1,
        stopTimeout: 5,

        // Application config
        debug: false,

        // Android config
        forceReloadOnLocationChange: false,
        forceReloadOnMotionChange: false,
        forceReloadOnGeofence: false,
        stopOnTerminate: true,
        startOnBoot: true,

        // iOS config
        stationaryRadius: 200, // restart tracking after the user has moved 200m
        useSignificantChangesOnly: true,
        disableMotionActivityUpdates: true,
      };
    } else {
      // High Accuracy Mode
      config = {
        // License validations
        orderId: Settings.licenses.BackgroundGeolocation.bundleId,
        license: Settings.licenses.BackgroundGeolocation.key,

        // Geolocation config
        desiredAccuracy: 10,
        distanceFilter: 50,
        locationUpdateInterval: 10000,
        fastestLocationUpdateInterval: 10000,

        // Activity Recognition config
        minimumActivityRecognitionConfidence: 80,
        activityRecognitionInterval: 15000,
        stopDetectionDelay: 1,
        stopTimeout: 2,

        // Application config
        debug: false,

        // Android config
        forceReloadOnLocationChange: false,
        forceReloadOnMotionChange: false,
        forceReloadOnGeofence: false,
        stopOnTerminate: true,
        startOnBoot: true,

        // iOS config
        stationaryRadius: 100, // restart tracking after the user has moved 100m
        useSignificantChangesOnly: false,
        disableMotionActivityUpdates: false,
      }
    }
    if (options.isInitial) {
      BackgroundGeolocation.configure(config, callback);
    } else {
      BackgroundGeolocation.setConfig(config);
      if (callback) callback();
    }
  } catch (e) {
    console.error(e)
  }
}

export function initializeGeolocationService() {
  BackgroundGeolocation.stop();
  configureGeolocationService({isInitial: true}, (state) => {

    BackgroundGeolocation.on('error', function(error) {
      printTimelog('error');
      console.log(error.type + " Error: " + error.code)
    });

    // Create initial geofence hooks.
    setupGeofences(()=>{
      BackgroundGeolocation.start(() => {
        console.info('Geolocation tracking started.');
      })
    });
  })
}

export function handleAppStateChange(state) {
  console.log(state)
}

function printTimelog(msg) {
  let timing = ((Date.now() - startTimer) / 1000)
  timing = Math.ceil(timing)
  console.log(msg + ': ' + timing + 's')
}
