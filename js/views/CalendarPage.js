import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import moment from 'moment';

import Styles from '../styles/Styles';
import Color from '../styles/Color';
import Calendar from '../components/Calendar/Calendar';
import CalendarEvent from '../components/Calendar/CalendarEvent';
import Loading from '../components/Loading';

import { loadCachedFormDataById } from '../api/Forms';
import { loadCachedTimeTriggers } from '../api/Triggers';

const CalendarPage = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    survey: React.PropTypes.object,
  },

  getInitialState() {
    return {
      stage: 'loading',
      events: [],
      selectedEvent: null,
    };
  },

  componentDidMount() {
    loadCachedTimeTriggers({
      surveyId: this.props.survey ? this.props.survey.id : false,
      excludeCompleted: true,
      excludeExpired: true,
    }, (err, response) => {
      if (err) {
        console.warn(err);
        this.setState({ stage: 'error'});
        return;
      }

      const responseLength = response.length;
      const eventDates = [];
      const eventIndex = {};

      for (let i = 0; i < responseLength; i++) {
        const date = moment(response[i].datetime).format('YYYY-MM-DD');
        eventDates.push(date);

        if (!eventIndex[date]) {
          eventIndex[date] = [];
        }
        eventIndex[date].push({
          datetime: response[i].datetime,
          title: response[i].title,
          triggerId: response[i].id,
          formId: response[i].formId,
          surveyId: response[i].surveyId,
        });
      }

      this.eventIndex = eventIndex;

      this.setState({
        events: eventDates,
        selectedEvent: this.getSelectedEvent(moment().format('YYYY-MM-DD')),
      });

      setTimeout(() => {
        if (!this.cancelCallbacks) {
          this.setState({stage: 'ready'});
        }
      }, 300);
    });
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  /* Methods */
  selectDate(date) {
    const eventDate = moment(date).format('YYYY-MM-DD');

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
        availability: `Available: ${moment(event.datetime).format('LT')}`,
        formId: event.formId,
      };
    }
    return null;
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
          onPress={() => {
            const data = loadCachedFormDataById(event.formId);
            this.props.navigator.push({
              path: 'form',
              title: data.survey.title,
              survey: data.survey,
              form: data.form,
              type: 'datetime',
            });
          }}
        />
      );
    }
    return <Text style={Styles.calendar.eventWarningText}>No remaining events present on this selected date.</Text>;
  },

  render() {
    if (this.state.stage === 'loading') {
      return <Loading/>;
    } else if (this.state.stage === 'error') {
      return <Text style={[Styles.type.h2, {color: Color.faded}]}>Error loading scheduled dates...</Text>;
    }

    return (
      <View style={[Styles.container.defaultWhite, { flex: 1, overflow: 'hidden' }]}>
        <Calendar
          ref='_calendar'
          showControls
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={this.selectDate}
          onTouchPrev={() => console.log('Back TOUCH')}
          onTouchNext={() => console.log('Forward TOUCH')}
          onSwipePrev={() => console.log('Back SWIPE')}
          onSwipeNext={() => console.log('Forward SWIPE')}
          eventDates={this.state.events}
          customStyle={Styles.calendar}
        />
        {this.renderSelectedEvents()}
      </View>
    );
  },
});

module.exports = CalendarPage;
