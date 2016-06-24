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
      events: ['2016-06-01', '2016-06-04', '2016-06-09', '2016-06-12', '2016-06-15', '2016-06-21'],
    }
  },

  componentDidMount() {
    const self = this;
    loadAllCachedTimeTriggers({}, (err, response) => {
      console.log(response);
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
