import realm from '../data/Realm'
export default class Survey {
  getForms() {
    return Array.from(realm.objects('Form').filtered(`surveyId="${this.id}"`))
  }

  getFormAvailability() {
    let result = {
      availableTimeTriggers: 0,
      nextTimeTrigger: false,
      geofenceTriggersInRange: 0,
    }
    if (this.status != 'accepted') return result

    try {
      // Check for availability on pending time triggers.
      let timeTriggers = realm.objects('TimeTrigger').filtered(`surveyId="${this.id}"`)
      let availableTimeTriggers = timeTriggers.filtered(`triggered == true AND completed == false`)
      if (availableTimeTriggers && availableTimeTriggers.length > 0) {
        result.availableTimeTriggers = availableTimeTriggers.length
      }

      // Check for the next future time trigger.
      let nextTimeTriggers = timeTriggers.filtered(`triggered == false`).sorted('datetime')
      if (nextTimeTriggers && nextTimeTriggers.length > 0) {
        result.nextTimeTrigger = nextTimeTriggers[0].datetime
      }
      
      // TODO: Geofence trigger availability.
      // Blocked by geofencing not being implemented yet.
    } catch (e) {
      console.warn(e)
    }

    return result
  }
}
Survey.schema = {
  name: 'Survey',
  primaryKey: 'id',
  properties: {
  	id: 'string',
  	active: 'bool',
    createdAt: 'date',
    updatedAt: 'date',

    user: 'string',
    title: 'string',
    description: 'string',
    status: {type: 'string', default: 'pending'},
  }
}
