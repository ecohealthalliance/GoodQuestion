import { Platform } from 'react-native'
import Settings from '../settings'

import { addSchedule } from './Schedule'
import { checkTimeTriggers } from './Triggers'
import { setupGeofences } from './GeoFencing'

export const BackgroundGeolocation = Platform.OS === 'ios' ?
                                      require('react-native-background-geolocation') :
                                      require('react-native-background-geolocation-android')

let startTimer = Date.now()

export function configureGeolocationService(callback) {
  try {
    BackgroundGeolocation.stop()
    console.log('Configuring Geolocation...')
    BackgroundGeolocation.configure({
      // License validations
      orderId: Settings.licenses.BackgroundGeolocation.bundleId,
      license: Settings.licenses.BackgroundGeolocation.key,

      // Geolocation config
      desiredAccuracy: 0,
      distanceFilter: 25,
      locationUpdateInterval: 5000,
      fastestLocationUpdateInterval: 5000,

      // Activity Recognition config
      minimumActivityRecognitionConfidence: 80,
      activityRecognitionInterval: 10000,
      stopDetectionDelay: 1,
      stopTimeout: 2,

      // Application config
      debug: false,
      forceReloadOnLocationChange: false,  // Android
      forceReloadOnMotionChange: false,    // Android
      forceReloadOnGeofence: false,        // Android
      stopOnTerminate: false,              // Android
      startOnBoot: true,

      useSignificantChangesOnly: false, // iOS
      disableMotionActivityUpdates: false, // iOS
    }, callback)
  } catch (e) {
    console.error(e)
  }
}

export function initializeGeolocationService() {
  configureGeolocationService((state) => {
    // These events are triggered by the background process, they can be used to control geofence logic
    // Until we implement those triggers these can still be used for testing background behavior.
    BackgroundGeolocation.on('location', function(location) {
      // printTimelog('location update')
      // console.log(location)
    })

    BackgroundGeolocation.on('error', function(error) {
      // printTimelog('error')
      console.log(error.type + " Error: " + error.code)
    })

    BackgroundGeolocation.on('motionchange', function(location) {
      // printTimelog('motion change')
      // console.log(location)
    })

    BackgroundGeolocation.on('schedule', function(state) {
      console.log('Schedule event triggered, tracking enabled:', state.enabled)
      checkTimeTriggers()
    })

    // Check the time triggers on start regardless if there is a schedule cycle running.
    // Ommit notifications to prevent spam on login.
    checkTimeTriggers(true)
    
    // Create initial geofence hooks.
    setupGeofences()
  })
}

function printTimelog(msg) {
  let timing = ((Date.now() - startTimer) / 1000)
  timing = Math.ceil(timing)
  console.log(msg + ': ' + timing + 's')
}
