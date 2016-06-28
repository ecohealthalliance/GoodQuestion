import { InteractionManager, Platform } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'
import PushNotification from 'react-native-push-notification';

import { BackgroundGeolocation } from './BackgroundProcess'
import { loadCachedGeofenceTriggers } from './Triggers'
import { showToast } from './Notifications'


let activeMap; // Cache a MapPage component for to update when geofencing triggers are crossed.
let supressNotificationsTimestamp; // Timer to suppress repeated notifications when geofences get updated.

/**
 * Caches a MapPage component inside a variable for easy access
 * @param {element} component     React class element to be cached
 */
export function setActiveMap(component) {
  activeMap = component
  BackgroundGeolocation.on('geofence', crossGeofence);
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
 * Erases previous set of native geofences and adds new ones based on geofence triggers.
 */
export function setupGeofences() {
  // BackgroundGeolocation.stop()
  
  loadCachedGeofenceTriggers({excludeCompleted: true}, (err, response) => {
    resetGeofences((err) => {
      if (err) {
        console.warn('Unable to load geofence triggers');
        console.warn(err);
        return;
      }

      const triggerGeofences = response.map((trigger) => {
        return {
          identifier: trigger.id,
          radius: trigger.radius,
          latitude: trigger.latitude,
          longitude: trigger.longitude,
          notifyOnEntry: true,
          notifyOnExit: true,
          notifyOnDwell: true,
          loiteringDelay: 30000
        }
      })
      
      console.log('Adding ' + triggerGeofences.length + ' geofences...')
      supressNotificationsTimestamp = Date.now() + 5000;
      BackgroundGeolocation.addGeofences(triggerGeofences, function() {
          console.log("Successfully added geofences.");
      }, function(error) {
          console.warn("Failed to add geofences.", error);
      });

      BackgroundGeolocation.start(() => {
        console.info('Geolocation tracking started.');
      })
    })
    BackgroundGeolocation.on('geofence', crossGeofence);
  })
}

export function addGeofence(trigger) {
  const geofence = {
    identifier: trigger.id,
    radius: trigger.radius,
    latitude: trigger.latitude,
    longitude: trigger.longitude,
    notifyOnEntry: true,
    notifyOnExit: true,
    notifyOnDwell: true,
    loiteringDelay: 30000
  };
  
  supressNotificationsTimestamp = Date.now() + 5000;
  BackgroundGeolocation.addGeofence(geofence, function () {
    console.log("Successfully added geofence.");
    BackgroundGeolocation.on('geofence', crossGeofence);
  }, function (error) {
    console.warn("Failed to add geofence.", error);
  });
}

/**
 * Erases all active geofences in the native geofencing api.
 * @param  {Function} callback Callback function to execute afterwards.
 */
export function resetGeofences(callback) {
  supressNotificationsTimestamp = Date.now() + 5000;
  BackgroundGeolocation.removeGeofences(
    function success() {
      console.log('Cleared current geofencing settings.')
      callback(null)
    },
    function error(e) {
      console.warn('Error resetting geofencing settings.')
      console.warn(e)
      callback(e)
    }
  )
}

/**
 * Removes a Geofence from the background check
 * @param  {string} id Geofence indentifier
 */
export function removeGeofenceById(id) {
  supressNotificationsTimestamp = Date.now() + 5000;
  BackgroundGeolocation.removeGeofence(id, () => {
    console.log('Removed geofence: ' + id);
  });
}

/**
 * Returns an object containing last recorded geolocation data via an async callback
 * @param  {Function} callback   Returns object containing the current latitude, longitude, accuracy, and timestamp.
 */
export function getUserLocationData(callback) {
  BackgroundGeolocation.getLocations((locations) => {
    let current = locations[0];
    if (current && current.coords) {
      callback({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        accuracy: current.coords.accuracy,
        timestamp: current.timestamp,
      })
    } else {
      callback({
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        timestamp: new Date()
      })
    }
  });
}

/**
 * Event function for when geofences are entered, exited, or dwelled on.
 * @param  {objects} params Parameters provided by the crossed geofence
 */
function crossGeofence(params) {
  console.log('Geofence crossed: ' + params.action + ' - ' + params.identifier);
  
  // Update Map
  if (activeMap && activeMap.active) {
    activeMap.updateMarkers(params);
  }

  try {
    const trigger = realm.objects('GeofenceTrigger').filtered(`id = "${params.identifier}"`)[0];
    if (trigger) {
      // Notify on entry
      if (_.lowerCase(params.action) == 'enter' && supressNotificationsTimestamp < Date.now()) {
        const form = realm.objects('Form').filtered(`id = "${trigger.formId}"`)[0];
        const survey = realm.objects('Survey').filtered(`id = "${trigger.surveyId}"`)[0];

        if (form && survey) {
          if (Platform.OS === 'android') {
            BackgroundGeolocation.playSound(25);
          } else {
            // TODO: find a proper tone on iOS
            // http://iphonedevwiki.net/index.php/AudioServices
            // BackgroundGeolocation.playSound(1000);
          }

          showToast(form.title, 'New geofence form available.', 'globe', 8, () => {
            Store.navigator.push({
              path: 'form',
              title: survey.title,
              forms: form,
              survey: survey,
              type: 'geofence'
            });
          });
        }
      }
      
      // Update Geofence Trigger
      realm.write(() => {
        trigger.inRange = true;
        trigger.triggered = _.lowerCase(params.action) == 'exit' ? false : true;
        trigger.updateTimestamp = Date.now();
      })
    } else {
      console.warn('Trigger not found.');
    }
  } catch (e) {
    console.warn(e)
  }
}

/**
 * Dev: logs a list of the currently active geofences in the native API.
 */
export function logActiveGeofences() {
  BackgroundGeolocation.getGeofences(function(geofences) {
    console.log('active geofences: ')
    console.log(geofences)
  });
}