import { Platform } from 'react-native';
import Settings from '../settings';

const BackgroundGeolocation = Platform.OS === 'ios' ? require('react-native-background-geolocation') : require('react-native-background-geolocation-android');

export function configureGeolocationService(callback) {
  try {
    BackgroundGeolocation.stop();
    console.log('Configuring Geolocation...');
    BackgroundGeolocation.configure({
      // License validations
      orderId: Settings.licenses.BackgroundGeolocation.bundleId,
      license: Settings.licenses.BackgroundGeolocation.key,

      // Geolocation config
      desiredAccuracy: 10,
      distanceFilter: 50,
      locationUpdateInterval: 60000,
      fastestLocationUpdateInterval: 60000,
      // useSignificantChangesOnly: true,

      // Activity Recognition config
      minimumActivityRecognitionConfidence: 80,
      activityRecognitionInterval: 60000,
      stopDetectionDelay: 1,
      stopTimeout: 2,

      // Application config
      debug: false,
      forceReloadOnLocationChange: false,
      // Android
      forceReloadOnMotionChange: false,
      forceReloadOnGeofence: false,
      stopOnTerminate: false,
      startOnBoot: true,
      // iOS
      disableMotionActivityUpdates: true,
    }, callback);
  } catch (e) {
    console.error(e);
  }
}

export function initializeGeolocationService() {
  configureGeolocationService(() => {
    BackgroundGeolocation.on('error', (error) => {
      console.log(`${error.type} Error: ${error.code}`);
    });
  });
}

export { BackgroundGeolocation };
