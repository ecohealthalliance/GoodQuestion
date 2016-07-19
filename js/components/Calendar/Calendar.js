import React from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import CalendarDay from './CalendarDay';
import CalendarStyles from './CalendarStyles';

const DEVICE_WIDTH = Dimensions.get('window').width - 60,
      MAX_COLUMNS = 7,
      MAX_ROWS = 7,
      VIEW_INDEX = 2;

const Calendar = React.createClass({
  propTypes: {
    dayHeadings: React.PropTypes.array,
    onDateSelect: React.PropTypes.func,
    scrollEnabled: React.PropTypes.bool,
    showControls: React.PropTypes.bool,
    prevButtonText: React.PropTypes.string,
    nextButtonText: React.PropTypes.string,
    titleFormat: React.PropTypes.string,
    onSwipeNext: React.PropTypes.func,
    onSwipePrev: React.PropTypes.func,
    onTouchNext: React.PropTypes.func,
    onTouchPrev: React.PropTypes.func,
    eventDates: React.PropTypes.array,
    startDate: React.PropTypes.string,
    selectedDate: React.PropTypes.string,
    customStyle: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      scrollEnabled: false,
      showControls: false,
      prevButtonText: 'Prev',
      nextButtonText: 'Next',
      titleFormat: 'MMMM YYYY',
      dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      startDate: moment().format('YYYY-MM-DD'),
      eventDates: [],
      customStyle: {},
    };
  },

  getInitialState() {
    return {
      calendarDates: this.getInitialStack(),
      selectedDate: moment(this.props.selectedDate).format(),
      currentMonth: moment(this.props.startDate).format(),
    };
  },

  componentWillMount() {
    this.renderedMonths = [];
  },

  componentDidMount() {
    this._scrollToItem(VIEW_INDEX);
  },

  getInitialStack() {
    const initialStack = [];
    if (this.props.scrollEnabled) {
      initialStack.push(moment(this.props.startDate).subtract(2, 'month').format());
      initialStack.push(moment(this.props.startDate).subtract(1, 'month').format());
      initialStack.push(moment(this.props.startDate).format());
      initialStack.push(moment(this.props.startDate).add(1, 'month').format());
      initialStack.push(moment(this.props.startDate).add(2, 'month').format());
    } else {
      initialStack.push(moment(this.props.startDate).format());
    }
    return initialStack;
  },

  /* Methods */

  _prependMonth() {
    const calendarDates = this.state.calendarDates;
    calendarDates.unshift(moment(calendarDates[0]).subtract(1, 'month').format());
    calendarDates.pop();
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[this.props.scrollEnabled ? VIEW_INDEX : 0],
    });
  },

  _appendMonth() {
    const calendarDates = this.state.calendarDates;
    calendarDates.push(moment(calendarDates[calendarDates.length - 1]).add(1, 'month').format());
    calendarDates.shift();
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[this.props.scrollEnabled ? VIEW_INDEX : 0],
    });
  },

  _selectDate(date) {
    this.setState({
      selectedDate: date,
    });
    if (this.props.onDateSelect) {
      this.props.onDateSelect(date.format());
    }
  },

  _onPrev() {
    this._prependMonth();
    this._scrollToItem(VIEW_INDEX);
    if (this.props.onTouchPrev) {
      this.props.onTouchPrev(this.state.calendarDates[VIEW_INDEX]);
    }
  },

  _onNext() {
    this._appendMonth();
    this._scrollToItem(VIEW_INDEX);
    if (this.props.onTouchNext) {
      this.props.onTouchNext(this.state.calendarDates[VIEW_INDEX]);
    }
  },

  _scrollToItem(itemIndex) {
    const scrollToX = itemIndex * DEVICE_WIDTH;
    if (this.props.scrollEnabled) {
      this.refs.calendar.scrollTo({x: scrollToX, y: 0, animated: false});
    }
  },

  _scrollEnded(event) {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / DEVICE_WIDTH;

    if (currentPage < VIEW_INDEX) {
      this._prependMonth();
      this._scrollToItem(VIEW_INDEX);
      if (this.props.onSwipePrev) {
        this.props.onSwipePrev();
      }
    } else if (currentPage > VIEW_INDEX) {
      this._appendMonth();
      this._scrollToItem(VIEW_INDEX);
      if (this.props.onSwipeNext) {
        this.props.onSwipeNext();
      }
    }
    return false;
  },

  /* Styling */

  _dayCircleStyle(newDay, isSelected, isToday) {
    const dayCircleStyle = [CalendarStyles.dayCircleFiller, this.props.customStyle.dayCircleFiller];
    if (isSelected && !isToday) {
      dayCircleStyle.push(CalendarStyles.selectedDayCircle);
      dayCircleStyle.push(this.props.customStyle.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(CalendarStyles.currentDayCircle);
      dayCircleStyle.push(this.props.customStyle.currentDayCircle);
    }
    return dayCircleStyle;
  },

  _dayTextStyle(newDay, isSelected, isToday) {
    const dayTextStyle = [CalendarStyles.day, this.props.customStyle.day];
    if (isToday && !isSelected) {
      dayTextStyle.push(CalendarStyles.currentDayText);
      dayTextStyle.push(this.props.customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(CalendarStyles.selectedDayText);
      dayTextStyle.push(this.props.customStyle.selectedDayText);
    } else if (moment(newDay).day() === 6 || moment(newDay).day() === 0) {
      dayTextStyle.push(CalendarStyles.weekendDayText);
      dayTextStyle.push(this.props.customStyle.weekendDayText);
    }
    return dayTextStyle;
  },

  /* Render */

  renderTopBar() {
    if (this.props.showControls) {
      return (
        <View style={[CalendarStyles.calendarControls, this.props.customStyle.calendarControls]}>
          <TouchableOpacity style={[CalendarStyles.controlButton, this.props.customStyle.controlButton]} onPress={this._onPrev}>
            <Text style={[CalendarStyles.controlButtonText, this.props.customStyle.controlButtonText]}>{this.props.prevButtonText}</Text>
          </TouchableOpacity>
          <Text style={[CalendarStyles.title, this.props.customStyle.title]}>
            {moment(this.state.currentMonth).format(this.props.titleFormat)}
          </Text>
          <TouchableOpacity style={[CalendarStyles.controlButton, this.props.customStyle.controlButton]} onPress={this._onNext}>
            <Text style={[CalendarStyles.controlButtonText, this.props.customStyle.controlButtonText]}>{this.props.nextButtonText}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={[CalendarStyles.calendarControls, this.props.customStyle.calendarControls]}>
        <Text style={[CalendarStyles.title, this.props.customStyle.title]}>{moment(this.state.currentMonth).format(this.props.titleFormat)}</Text>
      </View>
    );
  },

  renderHeading() {
    return (
      <View style={[CalendarStyles.calendarHeading, this.props.customStyle.calendarHeading]}>
        {this.props.dayHeadings.map((day, i) =>
          <Text key={i} style={i === 0 || i === 6 ? [CalendarStyles.weekendHeading, this.props.customStyle.weekendHeading] : [CalendarStyles.dayHeading, this.props.customStyle.dayHeading]}>{day}</Text>
        )}
      </View>
    );
  },

  renderMonthView(date) {
    const dayStart = moment(date).startOf('month').format(),
          daysInMonth = moment(dayStart).daysInMonth(),
          offset = moment(dayStart).get('day'),
          weekRows = [];

    let currentDay = 0,
        newDay = moment(dayStart).set('date', currentDay),
        preFiller = 0,
        renderedMonthView = null;

    for (let i = 0; i < MAX_COLUMNS; i++) {
      const days = [];
      for (let j = 0; j < MAX_ROWS; j++) {
        if (preFiller < offset) {
          days.push(<CalendarDay key={`${i},${j}`} filler={true} />);
        } else if (currentDay < daysInMonth) {
          newDay = moment(dayStart).set('date', currentDay + 1);
          const isToday = moment().isSame(newDay, 'month') && moment().isSame(newDay, 'day') ? true : false; // eslint-disable-line
          const isSelected = moment(this.state.selectedDate).isSame(newDay, 'month') && moment(this.state.selectedDate).isSame(newDay, 'day') ? true : false; // eslint-disable-line
          let hasEvent = false;
          /* eslint-disable */
          if (this.props.eventDates) {
            for (let x = 0; x < this.props.eventDates.length; x++) {
              hasEvent = moment(this.props.eventDates[x]).isSame(newDay, 'day') ? true : false;
              if (hasEvent) {
                break;
              }
            }
          }
          /* eslint-enable*/

          days.push(
            <CalendarDay
              key={`${i},${j}`}
              onPress={this._selectDate}
              currentDay={currentDay}
              newDay={newDay}
              isToday={isToday}
              isSelected={isSelected}
              hasEvent={hasEvent}
              usingEvents={this.props.eventDates.length > 0 ? true : false} // eslint-disable-line
              customStyle={this.props.customStyle}
            />
          );
          currentDay++;
        }
        preFiller++;
      }

      if (days.length > 0 && days.length < 7) {
        for (let x = days.length; x < 7; x++) {
          days.push(<CalendarDay key={x} filler={true}/>);
        }
        weekRows.push(<View key={weekRows.length} style={[CalendarStyles.weekRow, this.props.customStyle.weekRow]}>{days}</View>);
      } else {
        weekRows.push(<View key={weekRows.length} style={[CalendarStyles.weekRow, this.props.customStyle.weekRow]}>{days}</View>);
      }
    }

    renderedMonthView = <View key={moment(newDay).month()} style={CalendarStyles.monthContainer}>{weekRows}</View>;
    // keep this rendered month view in case it can be reused without generating it again
    this.renderedMonths.push([date, renderedMonthView]);
    return renderedMonthView;
  },

  _renderedMonth(date) {
    let renderedMonth = null;
    if (moment(this.state.currentMonth).isSame(date, 'month')) {
      renderedMonth = this.renderMonthView(date);
    } else {
      for (let i = 0; i < this.renderedMonths.length; i++) {
        if (moment(this.renderedMonths[i][0]).isSame(date, 'month')) {
          renderedMonth = this.renderedMonths[i][1];
        }
      }
      if (!renderedMonth) {
        renderedMonth = this.renderMonthView(date);
      }
    }
    return renderedMonth;
  },

  render() {
    return (
      <View style={[CalendarStyles.calendarContainer, this.props.customStyle.calendarContainer]}>
        {this.renderTopBar()}
        {this.renderHeading(this.props.titleFormat)}
        {
          this.props.scrollEnabled
          ? <ScrollView
              ref='calendar'
              horizontal={true}
              scrollEnabled={true}
              pagingEnabled={true}
              removeClippedSubviews={true}
              scrollEventThrottle={600}
              showsHorizontalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              onMomentumScrollEnd={(event) => {
                this._scrollEnded(event);
              }}>
              {this.state.calendarDates.map((date) => {
                return this._renderedMonth(date);
              })}
            </ScrollView>
          : <View ref='calendar'>
              {this.state.calendarDates.map((date) => {
                return this._renderedMonth(date);
              })}
            </View>
        }
      </View>
    );
  },
});

module.exports = Calendar;
