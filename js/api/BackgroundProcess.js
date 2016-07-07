import { Platform } from 'react-native'
import Settings from '../settings'

import Store from '../data/Store'

import { addSchedule } from './Schedule'
import { checkTimeTriggers } from './Triggers'
import { setupGeofences } from './Geofencing'

export const BackgroundGeolocation = Platform.OS === 'ios' ?
                                      require('react-native-background-geolocation') :
                                      require('react-native-background-geolocation-android')

let startTimer = Date.now()

export function configureGeolocationService(options = {}, callback) {
  try {
    let config;

    if (options.energySaving) {
      // Energy-Saving Mode
      console.log('Configuring Geolocation: Energy-Saving Mode');
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
        stopDetectionDelay: 0,
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
        stationaryRadius: 200, // restart tracking after the user has moved 200m
        useSignificantChangesOnly: true,
        disableMotionActivityUpdates: true,
      };
    } else {
      // High Accuracy Mode
      console.log('Configuring Geolocation: High Accuracy Mode');
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
      BackgroundGeolocation.start((state) => {
        Store.backgroundServiceState = 'started';
        console.info('Geolocation tracking started.');
      });
    });
  })
}

/**
 * Configures the background service to use less energy when the app is not on the foreground.
 * Ignores 'inactive' state. (transitioning, in-call, etc.)
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
export function handleAppStateChange(state) {
  if (state === 'active') {
    configureGeolocationService({energySaving: false}, ()=>{
      // Switch to active tracking on Android devices
      if (Platform.OS === 'android' && Store.backgroundServiceState != 'started') {
        BackgroundGeolocation.stop(() => {
          BackgroundGeolocation.start((state) => {
            console.log(state);
            Store.backgroundServiceState = 'started';
            console.info('Geolocation tracking started.');
          });
        });
      }
    });
  } else if (state === 'background') {
    configureGeolocationService({energySaving: true}, ()=>{
      // Switch to geofence tracking only on Android devices.
      if (Platform.OS === 'android' && Store.backgroundServiceState != 'geofence-only') {
        BackgroundGeolocation.stop(() => {
          BackgroundGeolocation.startGeofences((state) => {
            console.log(state);
            Store.backgroundServiceState = 'geofence-only';
            console.info('Geolocation tracking started in geofence-only mode.');
          });
        });
      }
    });
  }
}

function printTimelog(msg) {
  let timing = ((Date.now() - startTimer) / 1000)
  timing = Math.ceil(timing)
  console.log(msg + ': ' + timing + 's')
}
