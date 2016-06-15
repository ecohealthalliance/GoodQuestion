import React, {
  StyleSheet,
  Text,
  Platform,
  View,
} from 'react-native'
import moment from 'moment'

import Styles from '../styles/Styles'
import Calendar from '../components/Calendar/Calendar'

import { loadAllCachedGeofenceTriggers } from '../api/Triggers'
import { loadCachedFormDataByGeofence } from '../api/Forms'
import { BackgroundGeolocation } from '../api/BackgroundProcess'
import { setActiveMap, clearActiveMap, getUserLocationData } from '../api/Geofencing'


const CalendarPage = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    triggers: React.PropTypes.object
  },

  getInitialState() {
    let triggers = this.props.triggers
    // Load all triggers if none were provided via props
    if (!triggers) {
      triggers = loadAllCachedGeofenceTriggers()
    }
    this.markers = []
    return {
      updates: 0,
      latitude: 28.46986,
      longitude: -81.58495,
      zoom: 0.01,
      markers: [],
      triggers: triggers,
    }
  },

  componentDidMount() {
  },

  componentWillUnmount() {
  },

  /* Methods */
  

  /* Render */
  render() {
    return (
      <View style={[Styles.container.defaultWhite, { flex: 1, overflow: 'hidden' }]}>
        <Calendar
          ref="_calendar"
          eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
          showControls
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={(date) => this.setState({ selectedDate: date })}
          onTouchPrev={() => console.log('Back TOUCH')}     // eslint-disable-line no-console
          onTouchNext={() => console.log('Forward TOUCH')}  // eslint-disable-line no-console
          onSwipePrev={() => console.log('Back SWIPE')}     // eslint-disable-line no-console
          onSwipeNext={() => console.log('Forward SWIPE')}  // eslint-disable-line no-console
          eventDates={['2016-06-01', '2016-06-04', '2016-06-09', '2016-06-12', '2016-06-15']}
          customStyle={Styles.calendar}
        />
        <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>
      </View>
    )
  }
})

const _styles = StyleSheet.create({
  iosMap: {
    flex: 1,
  },
  androidMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

module.exports = CalendarPage
