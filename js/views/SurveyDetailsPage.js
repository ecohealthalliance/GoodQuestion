import React, {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native'

import _ from 'lodash'
import Store from '../data/Store'
import Styles from '../styles/Styles'
import Color from '../styles/Color'
import { loadSurveyList } from '../api/Surveys'
import { loadForms } from '../api/Forms'
import SurveyListItem from '../components/SurveyListItem'
import Button from '../components/Button'

const SurveyDetailsPage = React.createClass ({
  propTypes: {
    survey: React.PropTypes.object.isRequired,
    forms: React.PropTypes.array.isRequired,
  },

  getDefaultProps: function () {
    let status = 'pending'
    return {
      title: 'Replace me',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae veritatis aliquam voluptatem omnis libero praesentium aliquid possimus modi culpa doloribus, soluta, tenetur! Cupiditate, nisi. Ut iusto recusandae error, possimus culpa.',
      user: 'University X',
      forms: [],
      status: status,
    };
  },

  getInitialState() {
    return {
      status: this.props.status, // pending, accepted, declined
      forms: this.props.forms,
      questions: [],
      formCount: this.props.forms.length,
      questionCount: 0,
      user: this.props.user,
    }
  },

  /* Methods */
  acceptSurvey() {

  },

  declineSurvey() {

  },

  /* Render */
  render() {
    return (
      <View style={Styles.container.fullView}>
        <ScrollView>
          <View style={Styles.survey.surveyDescription}>
            <Text style={Styles.type.h3}>{this.props.description}</Text>
          </View>

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

          <View style={Styles.survey.surveyNotes}>
            <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>Administered by:</Text>
            <Text style={[Styles.type.h2, {marginTop: 0, fontWeight: 'normal'}]}>{this.state.user}</Text>
          </View>
        </ScrollView>

        <View style={Styles.form.bottomForm}>
          <Button style={Styles.survey.acceptButton} action={this.acceptSurvey}>Accept</Button>
          <Button style={Styles.survey.declineButton} action={this.declineSurvey}>Decline</Button>
        </View>
      </View>
    )
  }
})

module.exports = SurveyDetailsPage
