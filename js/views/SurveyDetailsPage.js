import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native'

import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import Store from '../data/Store'
import Styles from '../styles/Styles'
import Color from '../styles/Color'
import { getSurveyForms } from '../api/Surveys'
import { loadCachedForms } from '../api/Forms'
import { loadCachedQuestions, loadQuestions } from '../api/Questions'
import { checkSurveyTimeTriggers } from '../api/Triggers'
import { setupGeofences } from '../api/Geofencing'
import realm from '../data/Realm'
import SurveyDetailsMenu from '../components/SurveyDetailsMenu'
import Loading from '../components/Loading'
import Button from '../components/Button'
import MapPage from './MapPage'
import CalendarPage from './CalendarPage'

import { InvitationStatus, markInvitationStatus, loadCachedInvitationById } from '../api/Invitations'

const SurveyDetailsPage = React.createClass ({
  propTypes: {
    survey: React.PropTypes.object.isRequired, // Realm.io Object
    formCount: React.PropTypes.number.isRequired,
    questionCount: React.PropTypes.number.isRequired,
    activeTab: 'survey',
  },

  getInitialState() {
    const invitation = loadCachedInvitationById(this.props.survey.id);
    let status = invitation && invitation.status ? invitation.status : InvitationStatus.PENDING;

    return {
      status: status,
    }
  },
  /* Methods */
  acceptSurvey() {
    const status = InvitationStatus.ACCEPTED;
    this.setState({status: status});
    markInvitationStatus(this.props.survey.id, status, (err, res) => {
      if (err) {
        console.warn(err);
        return;
      }
      checkSurveyTimeTriggers(this.props.survey, true);
      setupGeofences();
      this.props.navigator.push({
        path: 'form',
        title: this.props.survey.title,
        survey: this.props.survey,
      });
    });
  },

  declineSurvey() {
    const status = InvitationStatus.DECLINED;
    this.setState({status: status});
    markInvitationStatus(this.props.survey.id, status, (err, res) => {
      if (err) {
        console.warn(err);
        return;
      }
      this.props.navigator.pop();
    });
  },

  changeTab(tab) {
    this.setState({activeTab: tab});
  },

  /* Render */
  renderSurveyInfoPage() {
    let acceptButtonStyle = [Styles.survey.acceptButton]
    let acceptButtonTextStyle = {color: Color.positive}
    let declineButtonStyle = [Styles.survey.declineButton]
    let declineButtonTextStyle = {color: Color.warning}

    if (this.state.status === 'accepted') {
      acceptButtonStyle.push({backgroundColor: Color.positive})
      acceptButtonTextStyle = {color: Color.background2}
    } else if (this.state.status === 'declined') {
      declineButtonStyle.push({backgroundColor: Color.warning})
      declineButtonTextStyle = {color: Color.background2}
    }

    return (
      <View style={Styles.container.fullView}>
        <ScrollView>
          <View style={Styles.survey.surveyDescription}>
            <Text style={Styles.type.h3}>{this.props.survey.description}</Text>
          </View>

          <View style={Styles.survey.surveyStats}>
            <View style={Styles.survey.surveyStatsBlock}>
              <Text>Number of Forms</Text>
              <Text style={Styles.survey.surveyStatsNumber}>{this.props.formCount}</Text>
            </View>
            <View style={Styles.survey.surveyStatsBlock}>
              <Text>Number of Questions</Text>
              <Text style={Styles.survey.surveyStatsNumber}>{this.props.questionCount}</Text>
            </View>
          </View>

          <View style={Styles.survey.surveyNotes}>
            <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>Administered by:</Text>
            <Text style={[Styles.type.h2, {marginTop: 0, fontWeight: 'normal'}]}>{this.props.survey.user}</Text>
          </View>
        </ScrollView>

        <View style={[Styles.survey.acceptanceButtons, {padding: 0}]}>
          <Button style={acceptButtonStyle} textStyle={acceptButtonTextStyle} action={this.acceptSurvey}>
            <Icon name='check-circle' size={18} color={this.state.status === 'accepted' ?  Color.background2 : Color.positive} /> Accept
          </Button>
          <Button style={declineButtonStyle} textStyle={declineButtonTextStyle} action={this.declineSurvey}>
            <Icon name='times-circle' size={18} color={this.state.status === 'declined' ?  Color.background2 : Color.warning} /> Decline
          </Button>
        </View>
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
        <SurveyDetailsMenu changeTab={this.changeTab} />
      </View>
    )
  }



})

module.exports = SurveyDetailsPage
