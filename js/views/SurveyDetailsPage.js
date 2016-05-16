import React, {
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

  componentDidMount() {
    // Cache survey into device
    
  },

  /* Methods */
  acceptSurvey() {
    this.setState({status: 'accepted'})
  },

  declineSurvey() {
    this.setState({status: 'declined'})
  },

  showForms(tab) {
    // TODO Allow user to see Forms in a map and on a calendar
    if (this.cancelCallbacks) return

    // Temporary redirection to form 0
    this.selectForm(this.props.forms[0])
  },

  selectForm(form) {
    if (this.cancelCallbacks) return

    // TODO Support multiple forms
    this.props.navigator.push({
      path: 'form',
      title: this.props.survey.get('title'),
      form: form,
      survey: this.props.survey
    })
  },

  /* Render */

  renderFormButtons() {
    if (this.state.status === 'accepted') {
      return (
        <View style={[Styles.survey.formButtons]}>
          <Button style={[Styles.survey.formButton]} action={this.showForms.bind(this, 'map')}>
            <Icon name='map-marker' size={28} color={Color.secondary} />
          </Button>
          <Button style={[Styles.survey.formButton]} action={this.showForms.bind(this, 'calendar')}>
            <Icon name='clock-o' size={28} color={Color.secondary} />
          </Button>
          <Button style={[Styles.survey.formButton]} action={this.showForms.bind(this, 'no-trigger')}>
            <Icon name='bolt' size={28} color={Color.secondary} />
          </Button>
        </View>
      )
    }
  },

  render() {
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

          {this.renderFormButtons()}

          <View style={Styles.survey.surveyNotes}>
            <Text style={[Styles.type.h2, {marginTop: 0, color: Color.secondary}]}>Administered by:</Text>
            <Text style={[Styles.type.h2, {marginTop: 0, fontWeight: 'normal'}]}>{this.state.user}</Text>
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
    )
  }
})

module.exports = SurveyDetailsPage
