import { Platform } from 'react-native'
const BackgroundGeolocation = Platform.OS === 'android' ?
    require('react-native-background-geolocation') :
    require('react-native-background-geolocation-android')

export function configureGeolocationServices() {
  BackgroundGeolocation.configure({
    desiredAccuracy: 0,
    stationaryRadius: 50,
    distanceFilter: 50,
    disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
    locationUpdateInterval: 5000,
    minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change 
    fastestLocationUpdateInterval: 5000,
    activityRecognitionInterval: 10000,
    stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
    stopTimeout: 2, // 2 minutes
    activityType: 'AutomotiveNavigation',

    // Application config
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user) 
    forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user) 
    forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user) 
    stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
    startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

    // // HTTP / SQLite config
    // url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
    // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
    // autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
    // maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
    // headers: {
    //   "X-FOO": "bar"
    // },
    // params: {
    //   "auth_token": "maybe_your_server_authenticates_via_token_YES?"
    // }
  })
}