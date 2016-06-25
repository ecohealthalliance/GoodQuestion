import { StyleSheet, Dimensions } from 'react-native'
import Color from './Color'
import Variables from './Variables'

const DEVICE_WIDTH = Dimensions.get('window').width - 60

const CalendarStyles = StyleSheet.create({
  calendarContainer: {
    // flex: 1,
    paddingTop: 10,
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
    marginBottom: 20,
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
    marginBottom: 5,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 0,
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
  
  

  // Day Circles
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: Color.background3,
    width: 28,
    height: 28,
    borderRadius: 2,
  },
  eventDayCircle: {
    backgroundColor: Color.warning,
  },
  currentDayCircle: {
    // backgroundColor: Color.positive,
    borderRadius: 50,
  },
  selectedDayCircle: {
    borderColor: Color.primary,
    borderWidth: 2,
    // backgroundColor: Color.positive,
  },


  // Day Texts
  eventDayText: {
    color: 'white',
  },
  currentDayText: {
    // color: 'white',
  },
  selectedDayText: {
    // color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#cccccc',
  },


  // Event Info
  eventBlock: {
    marginTop: 20,
    marginHorizontal: 30,
    marginBottom: 45,
    backgroundColor: Color.background2,
    borderColor: Color.background1,
    borderWidth: 1,
    borderRadius: 5,
  },
  eventHeader: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginHorizontal: -10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: Color.background1,
  },
  eventHeaderText: {
    color: Color.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventText: {
    marginVertical: 5,
  },
  eventCategoryRow: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: Color.background1,
  },
  eventCategoryRowText: {
    fontSize: 20,
    color: Color.warning,
  },
  eventDescription: {
    padding: 10,
  },
  eventWarningText: {
    marginTop: 15,
    marginHorizontal: 30,
    lineHeight: 30,
    fontSize: 20,
    color: Color.faded,
    textAlign: 'center',
  },
})

module.exports = CalendarStyles
