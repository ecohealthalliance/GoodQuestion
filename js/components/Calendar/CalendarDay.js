import React, {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import moment from 'moment'
import CalendarStyles from './CalendarStyles'

const CalendarDay = React.createClass({

  propTypes: {
    newDay: React.PropTypes.object,
    isSelected: React.PropTypes.bool,
    isToday: React.PropTypes.bool,
    hasEvent: React.PropTypes.bool,
    currentDay: React.PropTypes.number,
    onPress: React.PropTypes.func,
    usingEvents: React.PropTypes.bool,
    filler: React.PropTypes.bool,
    customStyle: React.PropTypes.object,
  },

  getDefaultProps () {
    return {
      customStyle: {},
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isSelected !== nextProps.isSelected || this.props.hasEvent !== nextProps.hasEvent
  },

  _dayCircleStyle(newDay, isSelected, isToday) {
    var dayCircleStyle = [CalendarStyles.dayCircleFiller, this.props.customStyle.dayCircleFiller]
    if (isSelected && !isToday) {
      dayCircleStyle.push(CalendarStyles.selectedDayCircle)
      dayCircleStyle.push(this.props.customStyle.selectedDayCircle)
    } else if (isSelected && isToday) {
      dayCircleStyle.push(CalendarStyles.currentDayCircle)
      dayCircleStyle.push(this.props.customStyle.currentDayCircle)
    }
    return dayCircleStyle
  },

  _dayTextStyle(newDay, isSelected, isToday) {
    var dayTextStyle = [CalendarStyles.day, this.props.customStyle.day]
    if (isToday && !isSelected) {
      dayTextStyle.push(CalendarStyles.currentDayText)
      dayTextStyle.push(this.props.customStyle.currentDayText)
    } else if (isToday || isSelected) {
      dayTextStyle.push(CalendarStyles.selectedDayText)
      dayTextStyle.push(this.props.customStyle.selectedDayText)
    } else if (moment(newDay).day() === 6 || moment(newDay).day() === 0) {
      dayTextStyle.push(CalendarStyles.weekendDayText)
      dayTextStyle.push(this.props.customStyle.weekendDayText)
    }
    return dayTextStyle
  },

  render() {
    let {
      currentDay,
      newDay,
      isSelected,
      isToday,
      hasEvent,
      usingEvents,
      filler,
    } = this.props

    if (filler) {
      return (
        <TouchableWithoutFeedback>
          <View style={[CalendarStyles.dayButtonFiller, this.props.customStyle.dayButtonFiller]}>
            <Text style={[CalendarStyles.day, this.props.customStyle.day]}></Text>
          </View>
        </TouchableWithoutFeedback>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this.props.onPress(newDay)}>
          <View style={[CalendarStyles.dayButton, this.props.customStyle.dayButton]}>
            <View style={this._dayCircleStyle(newDay, isSelected, isToday)}>
              <Text style={this._dayTextStyle(newDay, isSelected, isToday)}>{currentDay + 1}</Text>
            </View>
            {usingEvents ?
              <View style={[CalendarStyles.eventIndicatorFiller, this.props.customStyle.eventIndicatorFiller, hasEvent && CalendarStyles.eventIndicator, hasEvent && this.props.customStyle.eventIndicator]}></View>
              : null
            }
          </View>
        </TouchableOpacity>
      )
    }
  }
})

module.exports = CalendarDay