import { Platform } from 'react-native'
import Settings from '../settings'

import { addSchedule } from './Schedule'

export const BackgroundGeolocation = Platform.OS === 'android' ?
    require('react-native-background-geolocation') :
    require('react-native-background-geolocation-android')

let startTimer = Date.now()

export function configureGeolocationService() {
  try {
    BackgroundGeolocation.stop()
    console.log('Configuring Geolocation...')
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
      minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change 
      activityRecognitionInterval: 60000,
      stopDetectionDelay: 1,  // <--  minutes to delay after motion stops before engaging stop-detection system
      stopTimeout: 2, // 2 minutes

      // Application config
      debug: true,
      forceReloadOnLocationChange: false,  // Android
      forceReloadOnMotionChange: false,    // Android
      forceReloadOnGeofence: false,        // Android
      stopOnTerminate: false,              // Android
      startOnBoot: true,

      disableMotionActivityUpdates: true, // iOS

      schedule: [
        '2-6 9:00-9:59',
        '2-6 10:00-10:59',
        '2-6 11:00-11:59',
        '2-6 12:00-12:59',
        '2-6 13:00-13:59',
        '2-6 14:00-14:59',
        '2-6 15:00-15:59',
        '2-6 16:00-16:59',

        '1-7 23:50-23:59',
      ]
    })

    console.log(BackgroundGeolocation)
  } catch (e) {
    console.error(e)
  }
}

export function initializeGeolocationService() {
  configureGeolocationService()

  // This handler fires whenever bgGeo receives a location update.
  BackgroundGeolocation.on('location', function(location) {
    // console.log('- [js]location: ', JSON.stringify(location))
    printTimelog('location update')
  })

  BackgroundGeolocation.on('error', function(error) {
    // console.log(error.type + " Error: " + error.code)
    printTimelog('error')
  })

  BackgroundGeolocation.on('motionchange', function(location) {
    printTimelog('motion change')
  })

  BackgroundGeolocation.on('schedule', function(state) {
    console.log('Schedule event triggered, tracking enabled:', state.enabled)
  })

  BackgroundGeolocation.startSchedule(function() {
    console.info('- Scheduler started')
  })

  addSchedule()
}

function printTimelog(msg) {
  let timing = ((Date.now() - startTimer) / 1000)
  timing = Math.ceil(timing)
  console.log(msg + ': ' + timing)
}
