import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
} from 'react-native'
import moment from 'moment'

import Styles from '../styles/Styles'
import Calendar from '../components/Calendar/Calendar'
import CalendarEvent from '../components/Calendar/CalendarEvent'

import { loadAllCachedTimeTriggers } from '../api/Triggers'

const CalendarPage = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      events: [],
      selectedEvent: null,
    }
  },

  componentDidMount() {
    const self = this;
    loadAllCachedTimeTriggers({excludeCompleted: true, excludeExpired: true}, (err, response) => {
      const responseLength = response.length;
      const eventDates = [];
      const eventIndex = {};
      for (let i = 0; i < responseLength; i++) {
        const date = moment(response[i].datetime).format('YYYY-MM-DD');
        eventDates.push(date);

        if (!eventIndex[date]) eventIndex[date] = [];
        eventIndex[date].push({
          datetime: response[i].datetime,
          title: response[i].title,
        });
      }

      self.eventIndex = eventIndex;

      self.setState({
        events: eventDates,
        selectedEvent: self.getSelectedEvent(moment().format('YYYY-MM-DD')),
      });
    });
  },

  componentWillUnmount() {
  },

  /* Methods */
  selectDate(date) {
    let nextEvent = null;
    eventDate = moment(date).format('YYYY-MM-DD');

    this.setState({ 
      selectedDate: date,
      selectedEvent: this.getSelectedEvent(eventDate),
    });
  },

  getSelectedEvent(eventDate) {
    if (this.eventIndex[eventDate]) {
      const event = this.eventIndex[eventDate][0];
      return {
        type: 'datetime',
        title: moment(eventDate).format('MMMM Do YYYY'),
        description: event.title,
        availability: 'Available: ' + moment(event.datetime).format('LT'),
      };
    } else {
      return null;
    }
  },

  /* Render */
  renderSelectedEvents() {
    if (this.state.selectedEvent) {
      const event = this.state.selectedEvent;
      return (
        <CalendarEvent
          id='1'
          type='datetime'
          title={event.title}
          description={event.description}
          availability={event.availability}
          questionCount={10}
          properties={{}}
        />
      )
    } else {
      return <Text style={Styles.calendar.eventWarningText}>No remaining events present on this selected date.</Text>
    }
  },

  render() {
    return (
      <View style={[Styles.container.defaultWhite, { flex: 1, overflow: 'hidden' }]}>
        <Calendar
          ref="_calendar"
          showControls
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={this.selectDate}
          onTouchPrev={() => console.log('Back TOUCH')}     // eslint-disable-line no-console
          onTouchNext={() => console.log('Forward TOUCH')}  // eslint-disable-line no-console
          onSwipePrev={() => console.log('Back SWIPE')}     // eslint-disable-line no-console
          onSwipeNext={() => console.log('Forward SWIPE')}  // eslint-disable-line no-console
          eventDates={this.state.events}
          customStyle={Styles.calendar}
        />
        {this.renderSelectedEvents()}
      </View>
    )
  }
})

module.exports = CalendarPage
