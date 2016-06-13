import { InteractionManager } from 'react-native'
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
  const triggers = Array.from(loadAllCachedGeofenceTriggers())

  triggers.map((trigger) => {
    BackgroundGeolocation.addGeofence({
        identifier: trigger.id,
        radius: trigger.radius,
        latitude: trigger.latitude,
        longitude: trigger.longitude,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: true,
        loiteringDelay: 5000
    }, function() {
        console.log("Successfully added geofence");
    }, function(error) {
        console.warn("Failed to add geofence", error);
    })
  })

  connectMapToGeofence()
}


function connectMapToGeofence() {
  BackgroundGeolocation.onGeofence((params, taskId) => {
    console.log('GeoFence triggered')
    console.log(params)
    console.log(taskId)
    updateMapMarkers(params)
  })

  BackgroundGeolocation.on('geofence', (params) => {
    try {
      console.log('A geofence has been crossed: ', params.identifier)
      console.log('ENTER or EXIT?: ', params.action)
      console.log('location: ', JSON.stringify(params.location))
      console.log(params)

      updateMapMarkers(params)
    } catch(e) {
        console.error('An error occurred in my application code', e);
    }
  })
}

function updateMapMarkers(params) {
  if (activeMap && activeMap.active) {
    activeMap.updateMarkers(params)
  }
}