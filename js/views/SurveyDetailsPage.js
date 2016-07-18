import React from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import SurveyDetailsMenu from '../components/SurveyDetailsMenu';
import Loading from '../components/Loading';
import Button from '../components/Button';
import MapPage from './MapPage';
import CalendarPage from './CalendarPage';

import { acceptSurvey, declineSurvey } from '../api/Surveys';
import { getFormAvailability, loadCachedForms, loadCachedFormDataByTriggerId } from '../api/Forms';
import { loadCachedQuestionsFromForms } from '../api/Questions';
import { checkSurveyTimeTriggers } from '../api/Triggers';
import { InvitationStatus, markInvitationStatus, loadCachedInvitationById } from '../api/Invitations';

const SurveyDetailsPage = React.createClass({
  propTypes: {
    survey: React.PropTypes.object.isRequired,
    activeTab: React.PropTypes.string,
  },

  getInitialState() {
    return {
      loading: true,
      status: InvitationStatus.PENDING,
      acceptText: 'Accept',
      declineText: 'Decline',
    };
  },

  componentDidMount() {
    const renderDelay = Platform.OS === 'android' ? 300 : 50;

    setTimeout(()=>{
      if (!this.cancelCallbacks) {
        const invitation = loadCachedInvitationById(this.props.survey.id);
        const forms = loadCachedForms(this.props.survey.id);
        const questions = loadCachedQuestionsFromForms(forms);

        const status = invitation && invitation.status ? invitation.status : InvitationStatus.PENDING;

        this.setState({
          loading: false,
          forms: forms,
          formCount: forms.length,
          questions: questions,
          questionCount: questions.length,
          status: status,
          activeTab: 'surveys',
          availability: {
            availableTimeTriggers: 0,
            nextTimeTrigger: false,
            geofenceTriggersInRange: 0,
          },
        });


        if (this.state.status === 'accepted') {
          this.getSurveyData();
        }
      }
    }, renderDelay);
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  /* Methods */
  acceptCurrentSurvey() {
    const self = this;
    const status = InvitationStatus.ACCEPTED;
    
    this.setState({
      status: status,
      acceptText: 'Saving ...',
    }, ()=>{
      markInvitationStatus(this.props.survey.id, status, (err, res) => {
        this.setState({
          acceptText: 'Accept',
        });
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
      );
    }
  },

  confirmDeclineCurrentSurvey() {
    const status = InvitationStatus.DECLINED;
    this.setState({
      status: status,
      declineText: 'Saving ...',
    }, () => {
      markInvitationStatus(this.props.survey.id, status, (err) => {
        this.setState({
          declineText: 'Decline',
        });
        if (err) {
          console.warn(err);
          return;
        }
        declineSurvey(this.props.survey);
        this.props.navigator.pop();
      });
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
    const triggerId = this.state.availability.currentTrigger.id;
    let form;
    if (triggerId) {
      const data = loadCachedFormDataByTriggerId(triggerId, type);
      form = data.form;
    }

    this.props.navigator.push({
      path: 'form',
      title: this.props.survey.title + ': ' + form.title,
      survey: this.props.survey,
      form: form,
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
        marginVertical: 10,
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
          <Icon name='check-circle' size={18} color={this.state.status === 'accepted' ?  Color.background2 : Color.positive} />
          <Text> {this.state.acceptText} </Text>
        </Button>
        <Button style={declineButtonStyle} textStyle={declineButtonTextStyle} action={this.declineCurrentSurvey}>
          <Icon name='times-circle' size={18} color={this.state.status === 'declined' ?  Color.background2 : Color.warning} />
          <Text> {this.state.declineText} </Text>
        </Button>
      </View>
    );
  },

  renderFormAvailability() {
    const { geofenceTriggersInRange, availableTimeTriggers, nextTimeTrigger } = this.state.availability;

    if (geofenceTriggersInRange > 0) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            <Icon name='map-marker' size={20} color={Color.faded} /> {geofenceTriggersInRange} geofence {geofenceTriggersInRange > 1 ? 'forms' : 'form'} available.
          </Text>
          <Button style={[Styles.survey.answerButton]} textStyle={{color: Color.primary}} action={this.navigateToForms.bind(null, 'geofence')}>
            Answer Form
          </Button>
        </View>
      );
    } else if (availableTimeTriggers > 0) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            <Icon name='clock-o' size={20} color={Color.faded} /> {availableTimeTriggers} scheduled {availableTimeTriggers > 1 ? 'forms' : 'form'} available.
          </Text>
          <Button style={[Styles.survey.answerButton]} textStyle={{color: Color.primary}} action={this.navigateToForms.bind(null, 'datetime')}>
            Answer Form
          </Button>
        </View>
      );
    } else if (nextTimeTrigger && nextTimeTrigger > Date.now()) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            Next form: {moment(nextTimeTrigger).fromNow()}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            No forms currently available.
          </Text>
        </View>
      );
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
            this.state.status === InvitationStatus.ACCEPTED && this.state.questionCount > 0 ?
            <View style={Styles.survey.surveyStats}>
              <View style={Styles.survey.surveyStatsBlock}>
                <Text>{this.state.formCount} Forms</Text>
              </View>
              <View style={Styles.survey.surveyStatsBlock}>
                <Text>{this.state.questionCount} Questions</Text>
              </View>
            </View>
            :
            <View style={Styles.survey.surveyStats}>
              <View style={Styles.survey.surveyStatsBlock}>
                <Text>Contains {this.state.formCount} forms total.</Text>
              </View>
            </View>
          }

          <View style={{padding: 30}}>
            { this.state.status === 'accepted' ? this.renderFormAvailability() : null }

            <View style={[Styles.survey.surveyNotes, {paddingVertical: this.state.status === 'accepted' ? 15 : 30}]}>
              <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>Administered by:</Text>
              <Text style={[Styles.type.h2, {marginTop: 0, fontWeight: 'normal'}]}>{this.props.survey.user}</Text>
            </View>

            { this.state.status === 'accepted' ? this.renderAcceptButtons() : null }
          </View>

        </ScrollView>

        {this.state.status === 'accepted' ? null : this.renderAcceptButtons()}
      </View>
    );
  },

  render() {
    if (this.state.loading) {
      return <Loading/>;
    }

    let tab = null;
    switch (this.state.activeTab) {
      case 'geofence':
        tab = <MapPage navigator={this.props.navigator} survey={this.props.survey} />;
        break;
      case 'scheduled':
        tab = <CalendarPage navigator={this.props.navigator} survey={this.props.survey} />;
        break;
      default:
        tab = this.renderSurveyInfoPage();
        break;
    }

    return (
      <View style={{flex: 1}}>
        {tab}
        {this.state.status === 'accepted' ? <SurveyDetailsMenu changeTab={this.changeTab} /> : null}
      </View>
    );
  },
});

module.exports = SurveyDetailsPage;
