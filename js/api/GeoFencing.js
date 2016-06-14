import { InteractionManager, Platform } from 'react-native'
import { BackgroundGeolocation } from './BackgroundProcess'
import { loadAllCachedGeofenceTriggers } from './Triggers'
import _ from 'lodash'
import Parse from 'parse/react-native'
import Store from '../data/Store'
import realm from '../data/Realm'


let activeMap // Cache a MapPage component to update when geofencing triggers happen

export function setActiveMap(component) {
  activeMap = component
}

export function clearActiveMap(component) {
  if (activeMap == component) {
    activeMap = null
  }
}

export function setupGeofences() {
  BackgroundGeolocation.stop()
  const triggers = Array.from(loadAllCachedGeofenceTriggers())

  BackgroundGeolocation.removeGeofences(
    function success() {
      console.log('Cleared current geofencing settings.')
    },
    function error(e) {
      console.log('Error resetting geofencing settings.')
      console.log(e)
    }
  )

  const triggerGeofences = triggers.map((trigger) => {
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
      console.log("Successfully added geofences");
      BackgroundGeolocation.getGeofences((geofences) => {
        console.log(geofences)
      })
  }, function(error) {
      console.warn("Failed to add geofence", error);
  })

  if (Platform.OS === 'ios') {
    BackgroundGeolocation.start(() => {
      console.info('Geolocation tracking started.')
    })
  } else {
    BackgroundGeolocation.startGeofences(function() {
      console.info('Geofence tracking started.')
    })
  }

  connectMapToGeofence()
}


function connectMapToGeofence() {
  BackgroundGeolocation.on('geofence', (params) => {
    try {
      console.log('A geofence has been crossed!')
      updateMapMarkers(params)
    } catch(e) {
      console.error('Geofencing error.', e);
    }
  })
}

function updateMapMarkers(params) {
  if (activeMap && activeMap.active) {
    activeMap.updateMarkers(params)
  }
}