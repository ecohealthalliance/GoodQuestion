import { InteractionManager, Platform } from 'react-native'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'
import PushNotification from 'react-native-push-notification';

import { BackgroundGeolocation } from './BackgroundProcess'
import { loadAllCachedGeofenceTriggers } from './Triggers'
import { showToast } from './Notifications'


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
  // BackgroundGeolocation.stop()

  getUserLocationData((response) => {console.log(response)})

  loadAllCachedGeofenceTriggers((err, response) => {
    resetGeofences((err) => {
      if (err) {
        console.warn(err)
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
      BackgroundGeolocation.addGeofences(triggerGeofences, function() {
        try {
          console.log("Successfully added geofences.");
          BackgroundGeolocation.getGeofences((geofences) => {
            console.log('geofences added')
            console.log(geofences)
          })
        } catch (e) {
          console.warn(e)
        }
        
      }, function(error) {
          console.warn("Failed to add geofences.", error);
      })

      BackgroundGeolocation.start(() => {
        console.info('Geolocation tracking started.')
      })

      setTimeout(() => {
        BackgroundGeolocation.getGeofences(function(geofences) {
          console.log('active geofences: ')
          console.log(geofences)
        });
      } , 2000);

      

    })

    connectMapToGeofence()
  })
}

export function resetGeofences(callback) {
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
      console.log('A geofence has been crossed!');
      crossGeofence(params);
      if (activeMap && activeMap.active) {
        // Send a new set of geofence trigger parameters to the cached MapPage element.
        activeMap.updateMarkers(params);
      }
    } catch(e) {
      console.error('Geofencing error.', e);
    }
  })
}

function crossGeofence(params) {
  console.log('crossGeofence');
  console.log(params);

  alert(params.action)

  // Update Geofence Trigger
  try {
    const trigger = realm.objects('GeofenceTrigger').filtered(`id = "${params.identifier}"`)[0];
    if (trigger) {
      realm.write(() => {
        trigger.inRange = true;
        trigger.triggered = _.lowerCase(params.action) == 'exit' ? false : true;
      })
      // alert(JSON.stringify(trigger));

      // Notify on entry

      if (_.lowerCase(params.action) == 'enter') {
        const form = realm.objects('Form').filtered(`id = "${trigger.formId}"`)[0];
        const survey = realm.objects('Survey').filtered(`id = "${trigger.surveyId}"`)[0];
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
    } else {
      alert('Trigger not found.');
    }
  } catch (e) {
    console.warn(e)
  }
  
}