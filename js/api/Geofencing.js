import { Platform } from 'react-native';
import _ from 'lodash';
import Store from '../data/Store';
import realm from '../data/Realm';

import { BackgroundGeolocation } from './BackgroundProcess';
import { loadCachedGeofenceTriggers } from './Triggers';
import { showToast, notifyOnBackground } from './Notifications';

// Cache a MapPage component for to update when geofencing triggers are crossed.
let activeMap = null;
// Timer to suppress repeated notifications when geofences get updated.
let supressNotificationsTimestamp = 0;

/**
 * Event function for when geofences are entered, exited, or dwelled on.
 * @param  {objects} params Parameters provided by the crossed geofence
 */
export function crossGeofence(params) {
  console.log(`Geofence crossed: ${params.action} - ${params.identifier}`);

  // Update Map
  if (activeMap && activeMap.active) {
    activeMap.updateMarkers(params);
  }

  try {
    const trigger = realm.objects('GeofenceTrigger').filtered(`id = "${params.identifier}"`)[0];
    if (trigger) {
      // Notify on entry
      if (_.lowerCase(params.action) === 'enter' && supressNotificationsTimestamp < Date.now()) {
        const form = realm.objects('Form').filtered(`id = "${trigger.formId}"`)[0];
        const survey = realm.objects('Survey').filtered(`id = "${trigger.surveyId}"`)[0];

        if (form && survey) {
          notifyOnBackground(`${form.title} - New geofence form available.`, true);

          showToast(form.title, 'New geofence form available.', 'globe', 8, () => {
            Store.navigator.push({
              path: 'form',
              title: survey.title,
              forms: form,
              survey: survey,
              type: 'geofence',
            });
          });
        }
      }

      // Update Geofence Trigger
      realm.write(() => {
        trigger.triggered = true;
        trigger.inRange = _.lowerCase(params.action) !== 'exit';
        trigger.updateTimestamp = Date.now();
      });
    } else {
      console.warn('Trigger not found.');
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Caches a MapPage component inside a variable for easy access
 * @param {element} component     React class element to be cached
 */
export function setActiveMap(component) {
  activeMap = component;
  BackgroundGeolocation.on('geofence', crossGeofence);
}

/**
 * Clears and deactivates the currently cached map element
 * @param  {element} component    React class element to be cleared
 */
export function clearActiveMap(component) {
  if (activeMap === component) {
    component.active = false;
    activeMap = null;
  }
}

/**
 * Erases all active geofences in the native geofencing api.
 * @param  {Function} callback Callback function to execute afterwards.
 */
export function resetGeofences(callback) {
  supressNotificationsTimestamp = Date.now() + 5000;
  BackgroundGeolocation.removeGeofences(() => {
      console.log('Cleared current geofencing settings.');
      callback(null);
    }, (err) => {
      console.warn('Error resetting geofencing settings.');
      console.warn(err);
      callback(err);
    }
  );
}

/**
 * Creates native geofence objects using the 3rd-party geolocation library.
 * Erases previous set of native geofences and adds new ones based on geofence triggers.
 */
export function setupGeofences(callback) {
  // BackgroundGeolocation.stop()

  loadCachedGeofenceTriggers({excludeCompleted: true}, (err, response) => {
    resetGeofences((err2) => {
      if (err2) {
        console.warn('Unable to load geofence triggers');
        console.warn(err2);
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
          loiteringDelay: 30000,
        };
      });

      console.log(`Adding ${triggerGeofences.length} geofences...`);
      supressNotificationsTimestamp = Date.now() + 5000;
      BackgroundGeolocation.addGeofences(triggerGeofences, () => {
        console.log('Successfully added geofences.');

        // Restarts the service on Android devices.
        // This redundancy is a patch to force geofences to be rechecked in some devices.
        if (Platform.OS === 'android') {
          BackgroundGeolocation.start();
        }
      }, (err3) => {
        console.warn('Failed to add geofences.', err3);
      });

      if (callback) {
        callback();
      }
    });
    BackgroundGeolocation.on('geofence', crossGeofence);
  });
}

/**
 * Adds a single geofence to the native geolocation API.
 * @param {object} trigger Realm 'Trigger' object containing the geofence's required data.
 */
export function addGeofence(trigger) {
  const geofence = {
    identifier: trigger.id,
    radius: trigger.radius,
    latitude: trigger.latitude,
    longitude: trigger.longitude,
    notifyOnEntry: true,
    notifyOnExit: true,
    notifyOnDwell: false,
    loiteringDelay: 60000,
  };

  supressNotificationsTimestamp = Date.now() + 5000;
  BackgroundGeolocation.addGeofence(geofence, () => {
    console.log('Successfully added geofence.');
    BackgroundGeolocation.on('geofence', crossGeofence);
  }, (error) => {
    console.warn('Failed to add geofence.', error);
  });
}

/**
 * Removes a Geofence from the background check
 * @param  {string} id Geofence indentifier
 */
export function removeGeofenceById(id) {
  supressNotificationsTimestamp = Date.now() + 5000;
  BackgroundGeolocation.removeGeofence(id, () => {
    console.log(`Removed geofence: ${id}`);
  });
}

/**
 * Returns an object containing last recorded geolocation data via an async callback
 * @param  {Function} callback   Returns object containing the current latitude, longitude, accuracy, and timestamp.
 */
export function getUserLocationData(callback) {
  let coords = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    timestamp: new Date(),
  };

  if (Store.backgroundServiceState === 'deactivated') {
    console.log('deactivated, returning blank data');
    callback(coords);
    return;
  }

  try {
    BackgroundGeolocation.getLocations((locations) => {
      const current = locations[0];
      if (current && current.coords) {
        coords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          accuracy: current.coords.accuracy,
          timestamp: current.timestamp,
        };
        callback(coords);
      } else {
        callback(coords);
      }
    }, () => {
      callback(coords);
    });
  } catch (e) {
    callback(coords);
  }
}

/**
 * Dev: logs a list of the currently active geofences in the native API.
 */
export function logActiveGeofences() {
  BackgroundGeolocation.getGeofences((geofences) => {
    console.log('active geofences: ');
    console.log(geofences);
  });
}
