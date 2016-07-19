import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import moment from 'moment';
import CalendarStyles from './CalendarStyles';

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
    };
  },

  shouldComponentUpdate(nextProps) {
    return this.props.isSelected !== nextProps.isSelected || this.props.hasEvent !== nextProps.hasEvent;
  },

  _dayCircleStyle(newDay, isSelected, isToday, hasEvent) {
    const dayCircleStyle = [CalendarStyles.dayCircleFiller, this.props.customStyle.dayCircleFiller];
    if (hasEvent) {
      dayCircleStyle.push(CalendarStyles.eventDayCircle);
      dayCircleStyle.push(this.props.customStyle.eventDayCircle);
    }

    if (isToday) {
      dayCircleStyle.push(CalendarStyles.currentDayCircle);
      dayCircleStyle.push(this.props.customStyle.currentDayCircle);
    }

    if (isSelected) {
      dayCircleStyle.push(CalendarStyles.selectedDayCircle);
      dayCircleStyle.push(this.props.customStyle.selectedDayCircle);
    }

    return dayCircleStyle;
  },

  _dayTextStyle(newDay, isSelected, isToday, hasEvent) {
    const dayTextStyle = [CalendarStyles.day, this.props.customStyle.day];
    if (hasEvent) {
      dayTextStyle.push(CalendarStyles.eventDayText);
      dayTextStyle.push(this.props.customStyle.eventDayText);
    }

    if (isToday) {
      dayTextStyle.push(CalendarStyles.currentDayText);
      dayTextStyle.push(this.props.customStyle.currentDayText);
    }

    if (isSelected) {
      dayTextStyle.push(CalendarStyles.selectedDayText);
      dayTextStyle.push(this.props.customStyle.selectedDayText);
    }

    // TODO: Optional - Fade weekends
    // if (moment(newDay).day() === 6 || moment(newDay).day() === 0) {
    //   dayTextStyle.push(CalendarStyles.weekendDayText)
    //   dayTextStyle.push(this.props.customStyle.weekendDayText)
    // }
    return dayTextStyle;
  },

  render() {
    const {
      currentDay,
      newDay,
      isSelected,
      isToday,
      hasEvent,
      filler,
    } = this.props;

    if (filler) {
      return (
        <TouchableWithoutFeedback>
          <View style={[CalendarStyles.dayButtonFiller, this.props.customStyle.dayButtonFiller]}>
            <Text style={[CalendarStyles.day, this.props.customStyle.day]}></Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <TouchableOpacity onPress={() => this.props.onPress(newDay)}>
        <View style={[CalendarStyles.dayButton, this.props.customStyle.dayButton]}>
          <View style={this._dayCircleStyle(newDay, isSelected, isToday, hasEvent)}>
            <Text style={this._dayTextStyle(newDay, isSelected, isToday, hasEvent)}>{currentDay + 1}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
});

module.exports = CalendarDay;
