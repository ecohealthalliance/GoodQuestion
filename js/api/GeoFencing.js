import { InteractionManager } from 'react-native'
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


BackgroundGeolocation.onGeofence(this.updateMarkers)