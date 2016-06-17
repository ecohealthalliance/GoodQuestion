import { InteractionManager, Platform } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'
import PushNotification from 'react-native-push-notification';

import { BackgroundGeolocation } from './BackgroundProcess'
import { loadAllCachedGeofenceTriggers } from './Triggers'


let activeMap // Cache a MapPage component to update when geofencing triggers happen

/**
 * Caches a MapPage component inside a variable for easy access
 * @param {element} component     React class element to be cached
 */
export function setActiveMap(component) {
  activeMap = component
  connectMapToGeofence()
}

/**
 * Clears and deactivates the currently cached map element
 * @param  {element} component    React class element to be cleared
 */
export function clearActiveMap(component) {
  if (activeMap == component) {
    component.active = false
    activeMap = null
  }
}

/**
 * Creates native geofence objects using the 3rd-party geolocation library.
 * Based on currently active GeofenceTriggers. 
 */
export function setupGeofences() {
  BackgroundGeolocation.stop()

  loadAllCachedGeofenceTriggers((err, response) => {
    BackgroundGeolocation.removeGeofences(
      function success() {
        console.log('Cleared current geofencing settings.')
      },
      function error(e) {
        console.warn('Error resetting geofencing settings.')
        console.warn(e)
      }
    )

    const triggerGeofences = response.map((trigger) => {
      return {
        identifier: trigger.id,
        radius: trigger.radius,
        latitude: trigger.latitude,
        longitude: trigger.longitude,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: true,
        loiteringDelay: 5000
      }
    })

    BackgroundGeolocation.addGeofences(triggerGeofences, function() {
        console.log("Successfully added geofences.");
        // BackgroundGeolocation.getGeofences((geofences) => {
        //   console.log(geofences)
        // })
    }, function(error) {
        console.warn("Failed to add geofences.", error);
    })

    BackgroundGeolocation.start(() => {
      console.info('Geolocation tracking started.')
    })

    connectMapToGeofence()
  })
}

/**
 * Returns an object containing current geolocation data via an async callback
 * @param  {Function} callback   Returns object containing the current latitude, longitude, accuracy, and timestamp.
 */
export function getUserLocationData(callback) {
  BackgroundGeolocation.getCurrentPosition({timeout: 20}, function success(response) {
    callback({
      latitude: response.coords.latitude,
      longitude: response.coords.longitude,
      accuracy: response.coords.accuracy,
      timestamp: response.timestamp,
    })
  }, function error(err) {
    console.warn('Error retrieving geolocation data: ', err)
    locationData.error = err
    callback({
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: new Date()
    })
  })
}

/**
 * Links the currently cached MapPage element to the geofence events, allowing for updates on the component.
 */
function connectMapToGeofence() {
  BackgroundGeolocation.on('geofence', (params) => {
    try {
      console.log('A geofence has been crossed!')
      if (activeMap && activeMap.active) {
        // Send a new set of geofence trigger parameters to the cached MapPage element.
        activeMap.updateMarkers(params)
      }
    } catch(e) {
      console.error('Geofencing error.', e);
    }
  })
}

function notifyGeofenceLocalCrossing() {
  
}