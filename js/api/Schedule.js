import { BackgroundGeolocation } from './BackgroundProcess'

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