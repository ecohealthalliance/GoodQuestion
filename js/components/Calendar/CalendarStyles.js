// Original styles for Caldendar component
import { StyleSheet, Dimensions } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width - 60;

const CalendarStyles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
    color: '#cccccc',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 5,
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  dayButtonFiller: {
    padding: 5,
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  currentDayCircle: {
    // backgroundColor: 'red',
  },
  currentDayText: {
    // color: 'red',
  },
  eventDayCircle: {
    backgroundColor: 'red',
  },
  eventDayText: {
    color: 'white',
  },
  selectedDayCircle: {
    // backgroundColor: 'black',
  },
  selectedDayText: {
    // color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#cccccc',
  },
});

module.exports = CalendarStyles;
