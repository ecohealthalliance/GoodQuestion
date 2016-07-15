import React, {
  Text,
  View,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from '../styles/Styles';
import Color from '../styles/Color';
import { checkSurveyTimeTriggers } from '../api/Triggers';
import Button from '../components/Button';

import { InvitationStatus, markInvitationStatus } from '../api/Invitations';

const SurveyDetailsPage = React.createClass({
  propTypes: {
    // Realm.io Object
    survey: React.PropTypes.object.isRequired,
    formCount: React.PropTypes.number.isRequired,
    questionCount: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      status: InvitationStatus.PENDING,
      acceptText: 'Accept',
      declineText: 'Decline',
    };
  },
  /* Methods */

  acceptSurvey() {
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
        checkSurveyTimeTriggers(this.props.survey, true);
        this.props.navigator.push({
          path: 'form',
          title: this.props.survey.title,
          survey: this.props.survey,
        });
      });
    });
  },

  declineSurvey() {
    const status = InvitationStatus.DECLINED;
    this.setState({
      status: status,
      declineText: 'Saving ...',
    }, () => {
      this.setState({status: status});
      markInvitationStatus(this.props.survey.id, status, (err) => {
        this.setState({
          acceptText: 'Decline',
        });
        if (err) {
          console.warn(err);
          return;
        }
        this.props.navigator.pop();
      });
    });
  },

  /* Render */
  render() {
    let acceptButtonStyle = [Styles.survey.acceptButton];
    let acceptButtonTextStyle = {color: Color.positive};
    let declineButtonStyle = [Styles.survey.declineButton];
    let declineButtonTextStyle = {color: Color.warning};

    if (this.state.status === 'accepted') {
      acceptButtonStyle.push({backgroundColor: Color.positive});
      acceptButtonTextStyle = {color: Color.background2};
    } else if (this.state.status === 'declined') {
      declineButtonStyle.push({backgroundColor: Color.warning});
      declineButtonTextStyle = {color: Color.background2};
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
            <Icon name='check-circle' size={18} color={this.state.status === 'accepted' ? Color.background2 : Color.positive} />
            <Text> {this.state.acceptText} </Text>
          </Button>
          <Button style={declineButtonStyle} textStyle={declineButtonTextStyle} action={this.declineSurvey}>
            <Icon name='times-circle' size={18} color={this.state.status === 'declined' ? Color.background2 : Color.warning} />
            <Text> {this.state.declineText} </Text>
          </Button>
        </View>
      </View>
    );
  },
});

module.exports = SurveyDetailsPage;
