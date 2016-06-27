import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native'
import realm from '../data/Realm'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

import Store from '../data/Store'
import Styles from '../styles/Styles'
import Color from '../styles/Color'


import SurveyDetailsMenu from '../components/SurveyDetailsMenu'
import Loading from '../components/Loading'
import Button from '../components/Button'
import ViewText from '../components/ViewText'
import MapPage from './MapPage'
import CalendarPage from './CalendarPage'

import { getFormAvailability, acceptSurvey, declineSurvey } from '../api/Surveys'
import { loadCachedForms } from '../api/Forms'
import { loadCachedQuestionsFromForms } from '../api/Questions'
import { checkSurveyTimeTriggers, removeTriggers } from '../api/Triggers'
import { setupGeofences } from '../api/Geofencing'
import { InvitationStatus, markInvitationStatus, loadCachedInvitationById } from '../api/Invitations'

const SurveyDetailsPage = React.createClass ({
  propTypes: {
    survey: React.PropTypes.object.isRequired, // Realm.io Object
    activeTab: 'survey',
  },

  getInitialState() {
    const invitation = loadCachedInvitationById(this.props.survey.id);
    const forms = loadCachedForms(this.props.survey.id);
    const questions = loadCachedQuestionsFromForms(forms);

    let status = invitation && invitation.status ? invitation.status : InvitationStatus.PENDING;

    return {
      forms: forms,
      formCount: forms.length,
      questions: questions,
      questionCount: questions.length,
      status: status,
      availability: {
        availableTimeTriggers: 0,
        nextTimeTrigger: false,
        geofenceTriggersInRange: 0,
      },
    }
  },

  componentDidMount() {
    if (this.state.status === 'accepted') {
      this.getSurveyData();
    }
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  /* Methods */
  acceptCurrentSurvey() {
    const self = this;
    const status = InvitationStatus.ACCEPTED;
    this.setState({status: status});
    markInvitationStatus(this.props.survey.id, status, (err, res) => {
      if (err) {
        console.warn(err);
        return;
      }
      acceptSurvey(self.props.survey, (err, result) => {
        if (!self.cancelCallbacks) {
          self.getSurveyData();
        }
      });
      self.getSurveyData();
    });
  },

  declineCurrentSurvey() {
    if (this.state.status != 'accepted') {
      this.confirmDeclineCurrentSurvey();
    } else {
      Alert.alert(
        'Decline survey',
        'Are you sure you\'d like to decline this accepted survey?',
        [
          {text: 'Cancel', onPress: () => {console.log('Survey decline canceled')}, style: 'cancel'},
          {text: 'OK', onPress: () => {
            this.confirmDeclineCurrentSurvey();
          }},
        ]
      )
    }
  },

  confirmDeclineCurrentSurvey() {
    const status = InvitationStatus.DECLINED;
    markInvitationStatus(this.props.survey.id, status, (err, res) => {
      if (err) {
        console.warn(err);
        return;
      }
      declineSurvey(this.props.survey);
      this.props.navigator.pop();
    });
  },

  getSurveyData() {
    const questions = loadCachedQuestionsFromForms(this.state.forms, true);
    getFormAvailability(this.props.survey.id, (err, availability) => {
      if (err) {
        console.warn(err);
        return;
      }

      // Detect changes
      if (
        availability.availableTimeTriggers !== this.state.availability.availableTimeTriggers ||
        availability.nextTimeTrigger !== this.state.availability.nextTimeTrigger ||
        availability.geofenceTriggersInRange !== this.state.availability.geofenceTriggersInRange ||
        questions.length !== this.state.questionCount
      ) {
        this.setState({
          availability: availability,
          questions: questions,
          questionCount: questions.length,
        });
      }
    });
  },

  navigateToForms(type) {
    this.props.navigator.push({
      path: 'form',
      title: this.props.survey.title,
      survey: this.props.survey,
      type: type,
    });
  },

  changeTab(tab) {
    this.setState({activeTab: tab});
  },

  /* Render */
  renderAcceptButtons() {
    let acceptButtonStyle = [Styles.survey.acceptButton];
    let acceptButtonTextStyle = {color: Color.positive};
    let declineButtonStyle = [Styles.survey.declineButton];
    let declineButtonTextStyle = {color: Color.warning};
    let acceptedButtonContainerStyle = {};

    if (this.state.status === 'accepted') {
      acceptButtonStyle.push({backgroundColor: Color.positive});
      acceptButtonTextStyle = {color: Color.background2};
      acceptedButtonContainerStyle = {
        margin: 20,
        borderWidth: 2,
        borderTopWidth: 0,
        borderColor: Color.background1,
      };
    } else if (this.state.status === 'declined') {
      declineButtonStyle.push({backgroundColor: Color.warning});
      declineButtonTextStyle = {color: Color.background2};
    }

    return (
      <View style={[Styles.survey.acceptanceButtons, acceptedButtonContainerStyle]}>
        <Button style={acceptButtonStyle} textStyle={acceptButtonTextStyle} action={this.acceptCurrentSurvey}>
          <Icon name='check-circle' size={18} color={this.state.status === 'accepted' ?  Color.background2 : Color.positive} /> Accept
        </Button>
        <Button style={declineButtonStyle} textStyle={declineButtonTextStyle} action={this.declineCurrentSurvey}>
          <Icon name='times-circle' size={18} color={this.state.status === 'declined' ?  Color.background2 : Color.warning} /> Decline
        </Button>
      </View>
    );
  },

  renderFormAvailability() {
    let availabilityComponent;
    availability = this.state.availability;
    if (availability.geofenceTriggersInRange > 0) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            <Icon name='map-marker' size={20} color={Color.faded} /> {availability.geofenceTriggersInRange} geofence {availability.geofenceTriggersInRange > 1 ? 'forms' : 'form'} available.
          </Text>
          <Button style={[Styles.survey.answerButton]} textStyle={{color: Color.primary}} action={this.navigateToForms.bind(null, 'geofence')}>
            Answer Form
          </Button>
        </View>
      )

    } else if (availability.availableTimeTriggers > 0) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            <Icon name='clock-o' size={20} color={Color.faded} /> {availability.availableTimeTriggers} scheduled {availability.availableTimeTriggers > 1 ? 'forms' : 'form'} available.
          </Text>
          <Button style={[Styles.survey.answerButton]} textStyle={{color: Color.primary}} action={this.navigateToForms.bind(null, 'datetime')}>
            Answer Form
          </Button>
        </View>
      )
    } else if (availability.nextTimeTrigger && availability.nextTimeTrigger > Date.now() ) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            Next form: {moment(availability.nextTimeTrigger).fromNow()}
          </Text>
        </View>
      )
    } else {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            No forms currently available.
          </Text>
        </View>
      )
    }
  },

  renderSurveyInfoPage() {
    return (
      <View style={Styles.container.fullView}>
        <ScrollView>
          <View style={Styles.survey.surveyDescription}>
            <Text style={Styles.type.h3}>{this.props.survey.description}</Text>
          </View>

          {
            this.state.status == InvitationStatus.ACCEPTED && this.state.questionCount > 0 ?
            <View style={Styles.survey.surveyStats}>
              <View style={Styles.survey.surveyStatsBlock}>
                <Text>Number of Forms</Text>
                <Text style={Styles.survey.surveyStatsNumber}>{this.state.formCount}</Text>
              </View>
              <View style={Styles.survey.surveyStatsBlock}>
                <Text>Number of Questions</Text>
                <Text style={Styles.survey.surveyStatsNumber}>{this.state.questionCount}</Text>
              </View>
            </View>
            :
            <View style={Styles.survey.surveyStats}>
              <View style={Styles.survey.surveyStatsBlock}>
                <Text>Contains {this.state.formCount} Forms</Text> 
              </View>
            </View>
          }

          { this.state.status === 'accepted' ? this.renderFormAvailability() : null }

          <View style={Styles.survey.surveyNotes}>
            <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>Administered by:</Text>
            <Text style={[Styles.type.h2, {marginTop: 0, fontWeight: 'normal'}]}>{this.props.survey.user}</Text>
          </View>

          { this.state.status === 'accepted' ? this.renderAcceptButtons() : null }
        </ScrollView>

        {this.state.status === 'accepted' ? null : this.renderAcceptButtons()}
      </View>
    );
  },

  render() {
    let tab;
    switch(this.state.activeTab) {
      case 'geofence': tab = <MapPage navigator={this.props.navigator} />; break;
      case 'scheduled': tab = <CalendarPage navigator={this.props.navigator} />; break;
      default: tab = this.renderSurveyInfoPage(); break;
    }

    return (
      <View style={{flex: 1}}>
        {tab}
        {this.state.status === 'accepted' ? <SurveyDetailsMenu changeTab={this.changeTab} /> : null}
      </View>
    )
  }



})

module.exports = SurveyDetailsPage
