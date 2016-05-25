import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ScrollView,
  ListView,
  AsyncStorage,
  Platform,
  Alert,
} from 'react-native'
import _ from 'lodash'

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
import Button from 'apsl-react-native-button';
import Submission from '../models/Submission';
import Loading from '../components/Loading';
import Color from '../styles/Color';
import Swiper from 'react-native-page-swiper'
import { loadCachedForms } from '../api/Forms'
import { parseLoadFormsShim } from '../api/Forms'
import { validateUser } from '../api/Account'

import { loadCachedSubmissions, saveSubmission} from '../api/Submissions'
import { loadQuestions, loadCachedQuestions } from '../api/Questions'

import realm from '../data/Realm'

const FormPage = React.createClass ({
  form: null,
  nextForm: null,
  propTypes: {
    survey: React.PropTypes.object.isRequired,
    index: React.PropTypes.number,
  },

  getInitialState() {
    const forms = loadCachedForms(this.props.survey.id);
    let index = 0
    if (this.props.index) {
      index = this.props.index;
    }
    this.form = forms[index]
    this.nextForm = forms[index + 1]
    return {
      questions: loadCachedQuestions(this.form.id),
      answers: {},
      loading: false,
      index: index,
      button_text: 'Submit',
      questionIndex: 0,
    }
  },

  // beforePageChange(nextPage) {
  //   const shouldContinue = this.validatePage();
  //   if (!shouldContinue) {
  //     return false;
  //   }
  //   this.setIndex(nextPage);
  //   return true;
  // },

  componentWillMount() {
    const submissions = loadCachedSubmissions(this.form.id);
    if(submissions.length > 0) {
      this.setState({answers: JSON.parse(submissions.slice(-1)[0].answers)})
    }
  },

  componentWillUnmount() {
    this.cancelCallbacks = true
  },

  componentDidMount() {
    validateUser()
  },

  /* Methods */

  submit() {
    let answers = this.state.answers;
    let formId = this.form.id;
    let index = this.state.index;
    let survey = this.props.survey;
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

      //If there is another form continue onto that
      if(this.nextForm){
        this.props.navigator.push({ path: 'form',
                                    title: 'Survey: ' + survey.title,
                                    index: index + 1,
                                    survey: survey,
                                  });
      }
      else{
        this.props.navigator.push({name: 'surveyList', title: 'Surveys'});
      }
    });
  },

  setAnswer(questionId, value) {
    this.state.answers[questionId] = value;
  },

  onPageChange(page) {
    this.setState({
      questionIndex: page
    });
  },

  /* Render */

  renderQuestions() {
    var renderedQuestions = this.state.questions.map((question, idx)=>{
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
        case 'shortAnswer': return <View><ShortAnswer {...questionProps} /></View>
        case 'checkboxes': return <View><Checkboxes {...questionProps} /></View>
        case 'multipleChoice': return <View><MultipleChoice {...questionProps} /></View>
        case 'longAnswer': return <View><LongAnswerQuestion {...questionProps} /></View>
        case 'number': return <View><NumberQuestion {...questionProps} /></View>
        case 'scale': return <View><ScaleQuestion {...questionProps} /></View>
        case 'date':
          return Platform.OS === 'ios' ?
            <View><DateQuestionIOS {...questionProps} /></View>  :
            <View><DateQuestionAndroid {...questionProps} /></View>
        case 'datetime':
          return Platform.OS === 'ios' ?
            <View><DateQuestionIOS {...questionProps} mode="datetime" /></View> :
            <View><DatetimeQuestionAndroid {...questionProps} /></View>
        default: return <Text key={'unknown-question-'+idx}>Unknown Type: {question.type}</Text>;
      }
    })
    let buttonText = "Complete survey"
    if(this.nextForm){
      buttonText = "Submit and continue"
    }
    newLast = <View>
                {renderedQuestions[renderedQuestions.length-1]}
                <Button onPress={this.submit} style={Styles.form.submitBtn}>{buttonText}</Button>
              </View>
    renderedQuestions[renderedQuestions.length-1] = newLast
    return renderedQuestions;
  },
  render() {
    if (this.state.loading) {
      return (
        <View>
          <Loading />
          <Text style={Styles.type.h1}>Loading questions...</Text>
        </View>
      )
    } else {
      return (
        <Swiper
          style={{flex: 1}}
          activeDotColor={Color.background1}
          index={this.state.questionIndex}
          beforePageChange={this.beforePageChange}
          onPageChange={this.onPageChange}
          children={this.renderQuestions()}
          threshold={50}>
        </Swiper>
      )
    }
  }
})

module.exports = FormPage
