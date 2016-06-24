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
    }
  },

  componentDidMount() {
    const self = this;
    loadAllCachedTimeTriggers({}, (err, response) => {
      const responseLength = response.length;
      const eventDates = [];
      const eventIndex = {};
      for (var i = 0; i < responseLength; i++) {
        console.log(response[i])
        const date = moment(response[i].datetime).format('YYYY-MM-DD');
        console.log(date)
        eventDates.push(date);

        if (!eventIndex[date]) eventIndex[date] = [];
        eventIndex[date].push({
          time: '',
        });
      }

      self.setState({
        events: eventDates,
      });
    });
  },

  componentWillUnmount() {
  },

  /* Methods */
  

  /* Render */
  renderSelectedEvents() {
    return (
      <CalendarEvent
        id='1'    
        type='datetime'
        title='A Form'
        questionCount={10}
        properties={{}}
      />
    )
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
          onDateSelect={(date) => this.setState({ selectedDate: date })}
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
