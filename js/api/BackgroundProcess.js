import { Platform } from 'react-native'
import Settings from '../settings'

const BackgroundGeolocation = Platform.OS === 'android' ?
    require('react-native-background-geolocation') :
    require('react-native-background-geolocation-android')

export function configureGeolocationServices() {
  try {
    console.log('Configuring Geolocation...')
    BackgroundGeolocation.configure({
      // License validations
      orderId: Settings.licenses.BackgroundGeolocation.bundleId,
      license: Settings.licenses.BackgroundGeolocation.key,

      // Geolocation config
      desiredAccuracy: 0,
      distanceFilter: 50,
      locationUpdateInterval: 5000,
      fastestLocationUpdateInterval: 5000,

      // Activity Recognition config
      minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change 
      activityRecognitionInterval: 10000,
      stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
      stopTimeout: 2, // 2 minutes

      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user) 
      forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user) 
      forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user) 
      stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
      startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

      // HTTP / SQLite config
      url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      maxBatchSize: 100,      // <-- If using batchSync: true, specifies the max number of records send with each HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
      headers: {
        "X-FOO": "bar"
      },
      params: {
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    })
    console.log(BackgroundGeolocation)
  } catch (e) {
    console.error(e)
  }
}