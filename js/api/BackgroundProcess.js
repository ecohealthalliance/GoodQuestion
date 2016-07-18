import { Platform } from 'react-native';
import Settings from '../settings';
import Store from '../data/Store';
import { setupGeofences } from './Geofencing';

const BackgroundGeolocation = Platform.OS === 'ios' ? require('react-native-background-geolocation') : require('react-native-background-geolocation-android');

let startTimer = Date.now();


/**
 * Configures the geolocation library with initial configuration or energy-saving properties for background work.
 * @param     {Object}   options              Option arguments
 * @property  {bool}     options.isInitial    If true, will set the configuration for the initial load of the background process. (May also re-trigger geofences if standing over one) 
 * @property  {bool}     options.energySaving If true, will enable an energy-saving mode, at the cost of accuracy.
 * @param     {Function} callback             Called after the geolocation library updated its settings.
 */
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
    console.error(e);
  }
}

/**
 * Stops any running background services and initializes a new process.
 */
export function initializeGeolocationService() {
  // Temporarily disable this service for RN 0.29 migration
  return;

  BackgroundGeolocation.stop();
  configureGeolocationService({isInitial: true}, (state) => {

    BackgroundGeolocation.on('error', function(error) {
      printTimelog('error');
      console.log(error.type + " Error: " + error.code);
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
 * Ignores 'inactive' state. (transitioning, using phone, etc.)
 * @param  {string} state The new state the app is transitioning into: 'active', 'inactive', 'background'
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
  let timing = ((Date.now() - startTimer) / 1000);
  timing = Math.ceil(timing);
  console.log(msg + ': ' + timing + 's');
}

export { BackgroundGeolocation };