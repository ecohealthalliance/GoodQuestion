import { Platform } from 'react-native'
import Settings from '../settings'

import { addSchedule } from './Schedule'
import { checkTimeTriggers } from './Triggers'

export const BackgroundGeolocation = require('react-native-background-geolocation')

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
      forceReloadOnLocationChange: false,  // Android
      forceReloadOnMotionChange: false,    // Android
      forceReloadOnGeofence: false,        // Android
      stopOnTerminate: false,              // Android
      startOnBoot: true,

      disableMotionActivityUpdates: true, // iOS

      // We are using the on/off schedule as a temporary event caller for  time triggers before we implement the geolocation triggers
      // These triggers will have to be approached in other ways after that feature is developed.
      schedule: [
        '2-6 9:00-9:05',
        '2-6 10:00-10:05',
        '2-6 11:00-11:05',
        '2-6 12:00-12:05',
        '2-6 13:00-13:05',
        '2-6 14:00-14:05',
        '2-6 15:00-15:05',
        '2-6 16:00-16:05',
        '2-6 17:00-17:05',

        // '1-7 9:46-23:59', // for testing and debugging
      ]
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

    BackgroundGeolocation.startSchedule(function() {
      console.info('- Scheduler started')
    })

    // Check the time triggers on start regardless if there is a schedule cycle running.
    checkTimeTriggers()
  })
}

function printTimelog(msg) {
  let timing = ((Date.now() - startTimer) / 1000)
  timing = Math.ceil(timing)
  console.log(msg + ': ' + timing + 's')
}
