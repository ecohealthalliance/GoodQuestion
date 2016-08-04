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
import FormListPage from './FormListPage';
import MapPage from './MapPage';
import CalendarPage from './CalendarPage';

import { acceptSurvey, declineSurvey } from '../api/Surveys';
import { getFormAvailability, loadCachedForms, loadCachedFormDataById, loadCachedFormDataByTriggerId } from '../api/Forms';
import { loadCachedQuestionsFromForms } from '../api/Questions';
import { InvitationStatus, markInvitationStatus, loadCachedInvitationById } from '../api/Invitations';
import { cachedSubmissions } from '../api/Submissions';

const SurveyDetailsPage = React.createClass({
  _incompleteSubmissions: null,

  propTypes: {
    survey: React.PropTypes.object.isRequired,
    activeTab: React.PropTypes.string,
  },

  getInitialState() {
    if (this.props.currentUser) {
      this._incompleteSubmissions = cachedSubmissions.filtered(`userId == "${this.props.currentUser.id}" AND surveyId == "${this.props.survey.id}" AND inProgress == true`);
    }
    return {
      loading: true,
      status: InvitationStatus.PENDING,
      acceptText: 'Accept',
      declineText: 'Decline',
    };
  },

  componentDidMount() {
    const renderDelay = Platform.OS === 'android' ? 300 : 50;

    setTimeout(() => {
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
    const status = InvitationStatus.ACCEPTED;

    this.setState({
      status: status,
      acceptText: 'Saving ...',
    }, () => {
      markInvitationStatus(this.props.survey.id, status, (err) => {
        this.setState({
          acceptText: 'Accept',
        });
        if (err) {
          console.warn(err);
          return;
        }
        acceptSurvey(this.props.survey, (err2) => {
          if (err2) {
            console.warn(err);
            return;
          }
          if (!this.cancelCallbacks) {
            this.getSurveyData();
          }
        });
        this.getSurveyData();
      });
    });
  },

  declineCurrentSurvey() {
    if (this.state.status === 'accepted') {
      Alert.alert(
        'Decline survey',
        'Are you sure you\'d like to decline this accepted survey?',
        [
          {text: 'Cancel', style: 'cancel', onPress: () => {
            console.log('Survey decline canceled');
          }},
          {text: 'OK', onPress: () => {
            this.confirmDeclineCurrentSurvey();
          }},
        ]
      );
    } else {
      this.confirmDeclineCurrentSurvey();
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
    let form = null;
    if (type === 'incomplete') {
      const formId = this._incompleteSubmissions[0].formId;
      const data = loadCachedFormDataById(formId);
      form = data.form;
    } else {
      const triggerId = this.state.availability.currentTrigger.id;
      if (triggerId) {
        const data = loadCachedFormDataByTriggerId(triggerId, type);
        form = data.form;
      }
    }

    if (!form) {
      return;
    }

    this.props.navigator.push({
      path: 'form',
      title: this.props.survey.title,
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
    // Accept button
    let acceptButtonStyle = [Styles.survey.acceptButton];
    let acceptButtonTextStyle = {color: Color.positive};
    let acceptedButtonContainerStyle = {};
    let acceptIconColor = Color.positive;
    // Decline button
    let declineButtonStyle = [Styles.survey.declineButton];
    let declineButtonTextStyle = {color: Color.warning};
    let declineIconColor = Color.warning;

    if (this.state.status === 'accepted') {
      acceptButtonStyle.push({backgroundColor: Color.positive});
      acceptButtonTextStyle = {color: Color.background2};
      acceptedButtonContainerStyle = {
        marginVertical: 10,
        borderWidth: 2,
        borderTopWidth: 0,
        borderColor: Color.background1,
      };
      acceptIconColor = Color.background2;
    } else if (this.state.status === 'declined') {
      declineButtonStyle.push({backgroundColor: Color.warning});
      declineButtonTextStyle = {color: Color.background2};
      declineIconColor = Color.background2;
    }

    return (
      <View style={[Styles.survey.acceptanceButtons, acceptedButtonContainerStyle]}>
        <Button style={acceptButtonStyle} textStyle={acceptButtonTextStyle} action={this.acceptCurrentSurvey}>
          <Icon name='check-circle' size={18} color={acceptIconColor} />
          <Text> {this.state.acceptText} </Text>
        </Button>
        <Button style={declineButtonStyle} textStyle={declineButtonTextStyle} action={this.declineCurrentSurvey}>
          <Icon name='times-circle' size={18} color={declineIconColor} />
          <Text> {this.state.declineText} </Text>
        </Button>
      </View>
    );
  },

  renderFormAvailability() {
    const { geofenceTriggersInRange, availableTimeTriggers, nextTimeTrigger } = this.state.availability;

    // Incomplete form pending submission
    if (this._incompleteSubmissions.length > 0) {
      return (
        <View style={Styles.survey.surveyNotes}>
          <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
            <Icon name='question-circle' size={20} color={Color.faded} /> You have an incomplete form to finish.
          </Text>
          <Button style={[Styles.survey.answerButton]} textStyle={{color: Color.primary}} action={this.navigateToForms.bind(null, 'incomplete')}>
            Answer Form
          </Button>
        </View>
      );
    }

    // Forms available via triggers
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
    }

    return (
      <View style={Styles.survey.surveyNotes}>
        <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>
          No forms currently available.
        </Text>
      </View>
    );
  },

  renderSurveyInfoPage() {
    return (
      <View style={Styles.container.fullView}>
        <ScrollView>
          <View style={Styles.survey.surveyDescription}>
            <Text style={Styles.type.h3}>{this.props.survey.description}</Text>
          </View>

          {
            this.state.status === InvitationStatus.ACCEPTED && this.state.questionCount > 0
            ? <View style={Styles.survey.surveyStats}>
                <View style={Styles.survey.surveyStatsBlock}>
                  <Text>{this.state.formCount} Forms</Text>
                </View>
                <View style={Styles.survey.surveyStatsBlock}>
                  <Text>{this.state.questionCount} Questions</Text>
                </View>
              </View>
            : <View style={Styles.survey.surveyStats}>
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
      case 'forms':
        tab = <FormListPage navigator={this.props.navigator} survey={this.props.survey} forms={this.state.forms} />;
        break;
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
