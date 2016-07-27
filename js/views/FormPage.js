import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Text,
  View,
  ScrollView,
  ListView,
  AsyncStorage,
  Platform,
  Alert,
} from 'react-native'

import pubsub from 'pubsub-js';
import {ToastAddresses, ToastMessage} from '../models/ToastMessage';

import _ from 'lodash'
import dismissKeyboard from 'dismissKeyboard'

import Store from '../data/Store'
import Styles from '../styles/Styles';
import ShortAnswer from '../components/QuestionTypes/ShortAnswer';
import Checkboxes from '../components/QuestionTypes/Checkboxes';
import MultipleChoice from '../components/QuestionTypes/MultipleChoice';
import ScaleQuestion from '../components/QuestionTypes/ScaleQuestion'
import LongAnswerQuestion from '../components/QuestionTypes/LongAnswerQuestion'
import NumberQuestion from '../components/QuestionTypes/NumberQuestion'
import DateQuestionIOS from '../components/QuestionTypes/DateQuestionIOS'
import DateQuestionAndroid from '../components/QuestionTypes/DateQuestionAndroid'
import DatetimeQuestionAndroid from '../components/QuestionTypes/DatetimeQuestionAndroid'
import TimeQuestionAndroid from '../components/QuestionTypes/TimeQuestionAndroid'
import CompleteForm from '../components/QuestionTypes/CompleteForm'
import Button from 'apsl-react-native-button';
import Submission from '../models/Submission';
import Loading from '../components/Loading';
import Color from '../styles/Color';
import TypeStyles from '../styles/_TypeStyles';
import Swiper from '../components/Swiper/Swiper';
import SurveyFormNavigator from '../components/SurveyFormNavigator'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { loadTriggers, loadCachedTriggers } from '../api/Triggers'
import { validateUser } from '../api/Account'
import { loadCachedForms, loadActiveGeofenceFormsInRange } from '../api/Forms'
import { loadCachedSubmissions, saveSubmission} from '../api/Submissions'
import { loadCachedQuestions } from '../api/Questions'

import realm from '../data/Realm'

const FormPage = React.createClass ({
  form: null,
  nextForm: null,
  _questionIndex: 0,
  propTypes: {
    survey: React.PropTypes.object.isRequired,
    type: React.PropTypes.string,
    form: React.PropTypes.object,
    index: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      type: 'datetime',
      index: 0,
    }
  },

  getInitialState() {
    const forms = this.props.form ? [this.props.form] : loadCachedForms(this.props.survey.id);

    return {
      forms: forms,
      isLoading: true,
      index: this.props.index,
      button_text: 'Submit',
      formsInQueue: false
    };
  },

  validatePage() {
    let question = this.state.questions[this._questionIndex],
        answer = this.state.answers[question.id],
        properties = JSON.parse(question.properties)


    if(question.type == "number" || question.type == "scale") {
      if(properties.min && answer < properties.min) {
        return false
      }
      if(properties.max && answer > properties.max) {
        return false
      }
      return true
    }
    if(question.required) {
      if(question.type == "longAnswer" || question.type == "shortAnswer") {
        if(!answer) {
          Alert.alert("A response is required")
        }
        return Boolean(answer)
      } else {
        return true
      }
    } else {
      return true
    }
  },

  beforePageChange(currentPage, nextPage) {
    // Don't validate when going backwards
    if(nextPage < this._questionIndex) return true
    // Don't validate final page
    if(this._questionIndex >= this.state.questions.length) return true
    const shouldContinue = this.validatePage();
    if (!shouldContinue) {
      return false;
    }
    return true;
  },

  componentWillMount() {
    let self = this,
        index = this.state.index,
        type = this.props.type,
        answers = {},
        forms = this.state.forms,
        allForms = []
    
    if (!forms || forms.length === 0) {
      if (type === 'geofence') {
        forms = loadActiveGeofenceFormsInRange(this.props.survey.id);
      } else if (type === 'datetime') {
        forms = this.formsWithTriggers()
        allForms = forms
        forms = this.filterForms(forms)
        forms = this.sortForms(forms)
      }
    }

    if (!forms || forms.length === 0) {
      futureForms = _.filter(allForms, function(form){
        return form.trigger > new Date()
      })
      this.setState({isLoading: false, futureForms: futureForms, futureFormCount: futureForms.length})
      return
    }
    
    this.form = forms[index]
    this.nextForm = forms[index + 1]
    let submissions = loadCachedSubmissions(this.form.id),
        questions = loadCachedQuestions(this.form.id)
    if (submissions.length > 0) {
      answers = JSON.parse(submissions.slice(-1)[0].answers)
    } else {
      // Set default values
      questions.forEach((question, idx)=>{
        let properties = JSON.parse(question.properties)
        answers[question.id] = (()=>{
          switch (question.type) {
            case 'shortAnswer': return ""
            case 'checkboxes': return []
            case 'multipleChoice': return properties.choices[0]
            case 'longAnswer': return ""
            case 'number': return properties.min || 0
            case 'scale': return properties.min || 0
            case 'date': return new Date()
            case 'datetime': return new Date()
            default: return null
          }
        })()
      })
    }

    console.log('Forms setState')
    this.setState({
      questions: questions,
      answers: answers,
      forms: forms,
      formId: this.form.id,
      isLoading: false,
      answers: answers,
      formsInQueue: true
    })
  },

  componentWillUnmount() {
    this.cancelCallbacks = true
  },

  componentDidMount() {
    validateUser()
  },

  /* Methods */
  filterForms(forms) {
    let past = new Date()
    past = past.setDate(past.getDate() - 90) // Temporary 90-day expiration date for forms.
    return _.filter(forms, function(form){
      let triggerTime = form.trigger
      return triggerTime > past && triggerTime < new Date()
    })
  },

  sortForms(forms){
    return _.sortBy(forms, 'trigger')
  },

  formsWithTriggers() {
    return _.map(this.state.forms, function(form){
      loadCachedTriggers(form.id)
        .forEach(function(trigger){ form.trigger = trigger.datetime })
      return form
    })
  },

  showFutureFormCount(){
    if (this.state.futureFormCount > 0) {
      const futureForm = this.state.futureForms[0];
      const title = futureForm.title.trim();
      // TODO support triggers other than time
      const timeTrigger = moment(futureForm.trigger).fromNow();
      let message = `Stay tuned, there is ${this.state.futureFormCount} form remaining...`;
      let due = `The next form '${title}' is due ${timeTrigger}.`
      if (this.state.futureFormCount > 1) {
        message = `Stay tuned, there are ${this.state.futureFormCount} forms remaining...`;
      }
      return (
        <View>
          <Text style={[TypeStyles.statusMessage, TypeStyles.statusMessageSecondary]}>
            {message}
          </Text>
          <View style={{paddingTop: 15}}>
            <Text style={[TypeStyles.statusMessage, TypeStyles.statusMessageSecondary]}>
              {due}
            </Text>
          </View>
        </View>
      )
    }
  },

  submit() {
    let answers = this.state.answers,
        formId = this.form.id,
        index = this.state.index,
        survey = this.props.survey
    this.setState({
      button_text: 'Saving...'
    });

    saveSubmission(formId, answers, (err, res) => {
      if (err) {
        if (err === 'Invalid User') {
          this.props.logout();
          return;
        }
        Alert.alert('Error', err);
        return;
      }

      this.setState({
        button_text: 'Submit'
      });

      // Publish a ToastMessage to our Toaster via pubsub
      const toastMessage = ToastMessage.createFromObject({
        title: 'Success',
        duration: 2,
        message: 'The form has been submitted.',
        icon: 'check',
        iconColor: Color.fadedGreen,
      });
      pubsub.publish(ToastAddresses.SHOW, toastMessage);

      //If there is another form continue onto that
      if(this.nextForm){
        this.props.navigator.replace({ path: 'form',
                                    title: 'Survey: ' + survey.title,
                                    index: index + 1,
                                    survey: survey,
                                  });
      }
      else{
        this.props.navigator.resetTo({name: 'surveyList', title: 'Surveys'});
      }
    });
  },

  setAnswer(questionId, value) {
    this.state.answers[questionId] = value;
  },

  changePage(newIndex) {
    this._swiper.goToPage(newIndex)
  },

  onPageChange(page) {
    this._questionIndex = page
    if (this._nav) {
      this._nav.update(this._questionIndex, this.state.questions.length)
    }
  },

  dismiss() {
    dismissKeyboard();
  },

  /* Render */

  renderQuestions() {
    var renderedQuestions = this.state.questions.map((question, idx)=>{
      let questionComponent
      let questionProps = {
        key: question.id,
        id: question.id,
        value: this.state.answers[question.id],
        index: idx + 1,
        onChange: (value)=> {
          this.setAnswer(question.id, value)
        },
      }

      questionProps = _.merge(questionProps, question)
      if (questionProps.properties) questionProps.properties = JSON.parse(questionProps.properties)
      switch (question.type) {
        case 'shortAnswer': questionComponent = <ShortAnswer {...questionProps} />; break;
        case 'checkboxes': questionComponent = <Checkboxes {...questionProps} />; break;
        case 'multipleChoice': questionComponent = <MultipleChoice {...questionProps} />; break;
        case 'longAnswer': questionComponent = <LongAnswerQuestion {...questionProps} />; break;
        case 'number': questionComponent = <NumberQuestion {...questionProps} />; break;
        case 'scale': questionComponent = <ScaleQuestion {...questionProps} />; break;
        case 'date':
          questionComponent = Platform.OS === 'ios' ?
            <DateQuestionIOS {...questionProps} />  :
            <DateQuestionAndroid {...questionProps} />; break;
        case 'datetime':
          questionComponent = Platform.OS === 'ios' ?
            <DateQuestionIOS {...questionProps} mode="datetime" /> :
            <DatetimeQuestionAndroid {...questionProps} />; break;
        default: questionComponent = <Text key={'unknown-question-'+idx}>Unknown Type: {question.type}</Text>; break;
      }
      return (
        <TouchableWithoutFeedback
          onPress={this.dismiss}>
          <View style={{flex: 1}}>
            {questionComponent}
          </View>
        </TouchableWithoutFeedback>
      )
    })
    
    completeFormView = <View><CompleteForm submit={this.submit} nextForm={this.nextForm}/></View>
    renderedQuestions.push(completeFormView)
    return renderedQuestions
  },
  render() {
    console.warn('this.form')
    console.log(this.form)
    if (this.state.isLoading) {
      return (<Loading/>)
    } else if (!this.state.formsInQueue){
      return (
        <View style={TypeStyles.statusMessageContainer}>
          <Icon name="clock-o" size={100} color={Color.fadedRed} />
          <Text style={TypeStyles.statusMessage}>No active forms</Text>
          {this.showFutureFormCount()}
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1, paddingHorizontal: 20, overflow: 'hidden'}}>
            <Swiper
              ref={(swiper) => {this._swiper = swiper}}
              style={{flex: 1}}
              containerStyle={{overflow: 'visible'}}
              pager={false}
              index={this._questionIndex}
              beforePageChange={this.beforePageChange}
              onPageChange={this.onPageChange}
              children={this.renderQuestions()}
              threshold={50}>
            </Swiper>
          </View>

          <SurveyFormNavigator
            ref={(nav) => {this._nav = nav}}
            index={this._questionIndex}
            total={this.state.questions.length}
            onPressed={this.changePage}
           />
        </View>
      )
    }
  }
})

module.exports = FormPage
