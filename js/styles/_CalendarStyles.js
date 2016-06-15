import { StyleSheet, Dimensions } from 'react-native'
import Color from './Color'
import Variables from './Variables'

const DEVICE_WIDTH = Dimensions.get('window').width - 60

const CalendarStyles = StyleSheet.create({
  calendarContainer: {
    // flex: 1,
    paddingTop: 30,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
  monthContainer: {
    flex: 1,
  },
  calendarControls: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  controlButton: {
  },
  controlButtonText: {
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  calendarHeading: {
    flexDirection: 'row',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
    color: '#cccccc'
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    flex: 0.15,
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 0,
  },
  dayButtonFiller: {
    flex: 0.15,
    padding: 5,
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
    // backgroundColor: Color.background,
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc'
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: Color.background3,
    width: 28,
    height: 28,
    borderRadius: 2,
  },
  currentDayCircle: {
    backgroundColor: Color.positive,
    borderColor: Color.primary,
    borderWidth: 2,
  },
  currentDayText: {
    color: 'red',
  },
  eventDayCircle: {
    backgroundColor: Color.warning,
  },
  eventDayText: {
    color: 'white',
  },
  selectedDayCircle: {
    backgroundColor: 'black',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#cccccc',
  }
})

module.exports = CalendarStyles
