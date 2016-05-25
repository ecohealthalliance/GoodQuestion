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
import { loadSurveyList, loadCachedSurveyList } from '../api/Surveys'
import { loadCachedForms } from '../api/Forms'
import { loadCachedQuestions } from '../api/Questions'
import realm from '../data/Realm'
import SurveyListItem from '../components/SurveyListItem'
import Button from '../components/Button'

const SurveyDetailsPage = React.createClass ({
  propTypes: {
    survey: React.PropTypes.object.isRequired, // Realm.io Object
  },

  getInitialState() {
    let cachedSurvey, cachedForms, cachedQuestions = []
    try {
      cachedSurvey = this.props.survey
      cachedForms = loadCachedForms(this.props.survey.id)
      for (var i = 0; i < cachedForms.length; i++) {
        cachedQuestions = _.merge(
          cachedQuestions,
          loadCachedQuestions(cachedForms[i].id)
        )
      }
    } catch (e) {
      console.error(e)
    }

    if (!cachedForms || !cachedForms[0]) {
      alert('Error: Unable to fetch the Forms associated with this Survey.')
    } else if (!cachedQuestions || !cachedQuestions[0]) {
      alert('Error: Unable to fetch the Questions associated with this Survey.')
    }

    return {
      // Realm Cached Objects
      cachedSurvey: cachedSurvey,
      cachedForms: cachedForms,
      cachedQuestions: cachedQuestions,

      formCount: cachedForms.length,
      questionCount: cachedQuestions.length,

      // Data
      id: cachedSurvey.id,
      status: cachedSurvey.status.length === 0 ? 'pending' : cachedSurvey.status, // pending, accepted, declined
      user: cachedSurvey.user,
      description: cachedSurvey.description,

      // Parse Object
      // TODO replace with cached version in an optimization pass.
      forms: this.props.forms,
    }
  },

  /* Methods */
  acceptSurvey() {
    let survey = this.state.cachedSurvey
    this.setState({status: 'accepted'})
    realm.write(() => {
      survey.status = 'accepted'
    })
    this.showForms()
  },

  declineSurvey() {
    let survey = this.state.cachedSurvey
    this.setState({status: 'declined'})
    realm.write(() => {
      survey.status = 'declined'
    })
    this.props.navigator.pop()
    // this.props.navigator.push({path: 'surveylist', title: 'Surveys', sceneConfig: 'FloatFromLeft'})
  },

  showForms(tab) {
    // TODO Allow user to see Forms in a map and on a calendar
    if (this.cancelCallbacks) return

    // Temporary redirection to fist form
    // To be changed when we support multiple forms in V2
    this.selectForm(this.state.cachedForms[0])
  },

  selectForm(form) {
    if (this.cancelCallbacks) return

    //Gather questions only for this form
    // let questions = realm.objects('Question').filtered(`formId = "${form.id}"`)

    // TODO Support multiple forms & support cached forms
    this.props.navigator.push({
      path: 'form',
      title: this.props.survey.title,
      form: form,
      survey: this.state.cachedSurvey,
    })
  },

  /* Render */

  renderFormButtons() {
    if (this.state.status === 'accepted') {
      return (
        <View style={[Styles.survey.formButtons]}>
          <Button style={[Styles.survey.formButton]} action={this.showForms.bind(this, 'map')}>
            <Icon name='map-marker' size={28} color={Color.background3} />
          </Button>
          <Button style={[Styles.survey.formButton]} action={this.showForms.bind(this, 'calendar')}>
            <Icon name='clock-o' size={28} color={Color.background3} />
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
            <Text style={Styles.type.h3}>{this.state.description}</Text>
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
