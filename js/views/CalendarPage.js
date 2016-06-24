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
      eventIndex: {},
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
        console.log(response[i])
        const date = moment(response[i].datetime).format('YYYY-MM-DD');
        console.log(date)
        eventDates.push(date);

        if (!eventIndex[date]) eventIndex[date] = [];
        eventIndex[date].push({
          datetime: response[i].datetime,
          title: response[i].title,
        });
      }

      self.setState({
        events: eventDates,
        eventIndex: eventIndex,
      });
    });
  },

  componentWillUnmount() {
  },

  /* Methods */
  selectDate(date) {
    let nextEvent = null;
    eventDate = moment(date).format('YYYY-MM-DD');

    if (this.state.eventIndex[eventDate]) {
      const event = this.state.eventIndex[eventDate][0];
      nextEvent = {
        type: 'datetime',
        title: moment(date).format('MMMM Do YYYY'),
        description: event.title,
        availability: 'Available: ' + moment(event.datetime).format('LT'),
      };
    }


    this.setState({ 
      selectedDate: date,
      selectedEvent: nextEvent,
    });
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
      return <Text>No remaining events present on this date.</Text>
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
