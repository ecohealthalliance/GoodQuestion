import { BackgroundGeolocation } from './BackgroundProcess'

// Adds a schedule time to the geolocator.
// Currently we have these hard-coded so these methods will be left for V2
export function addSchedule(days, startTime, endTime) {
  BackgroundGeolocation.getState((state)=>{
    schedule = []
    if (state.schedule) schedule = state.schedule
    schedule.push(days + ' ' + startTime + '-' + endTime)
  })
}

export function resetSchedule(days, startTime, endTime) {
  BackgroundGeolocation.setConfig({schedule: false})
}