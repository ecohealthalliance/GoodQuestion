import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ScrollView,
  ListView,
  AsyncStorage,
  Platform,
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

import { loadQuestions } from '../api/Questions'
import Realm from 'realm';

const FormPage = React.createClass ({
  propTypes: {
    forms: React.PropTypes.array.isRequired,
    survey: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired
  },

  getInitialState() {
    this.realm = new Realm({schema: [Submission]});
    let index = 0
    if (this.props.index) {
      index = this.props.index;
    }
    form = this.props.forms[index]
    return {
      questions: [],
      answers: {},
      loading: true,
      index: index
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
    let submissions = this.realm
      .objects('Submission')
      .filtered(`formId = "${form.id}"`)
      .sorted('created');
    if(submissions.length > 0) {
      this.setState({answers: JSON.parse(submissions.slice(-1)[0].answers)})
    }
    loadQuestions(form, this.setQuestions)
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true
  },

  /* Methods */

  setQuestions(error, response) {

    // Prevent this callback from working if the component has unmounted.
    if (this.cancelCallbacks) return

    // Render the questions passed by the response object.
    if (error) {
      console.warn(error)
    } else if (!response || !response[0]){
      alert('Error: Unable to fetch the Questions associated with this Survey\'s Form.')
      this.props.navigator.pop()
    } else {
      this.setState({
        questions: response,
        loading: false,
      })
    }
  },

  submit() {
    // // TODO Get geolocation
    let realm = this.realm;
    let answers = this.state.answers;
    let formId = form.id;
    let index = this.props.index;
    let survey = this.props.survey;
    let forms = this.props.forms;
    realm.write(() => {
      let submission = realm.create('Submission', {
        formId: formId,
        created: new Date(),
        answers: JSON.stringify(answers),
      });
    });
    //If there is another form continue onto that
    if(forms[index+1]){
      this.props.navigator.push({ path: 'form', 
                                  title: 'Survey: ' + survey.get('title'),
                                  index: index +1,
                                  survey: survey,
                                  forms: forms,
                                });
    }
    else{
      this.props.navigator.push({name: 'surveyList', title: 'Surveys'});
    }
  },

  setAnswer(questionId, value) {
    this.state.answers[questionId] = value;
  },

  /* Render */

  renderQuestions() {
    let nextForm = this.props.forms[this.props.index + 1];
    var renderedQuestions = this.state.questions.map((question, index)=>{
      let questionProps = {
        key: question.id,
        id: question.id,
        value: this.state.answers[question.id],
        index: index + 1,
        onChange: (value)=> {
          this.setAnswer(question.id, value)
        },
      }
      let forms = this.props.forms;

      if (question.attributes) {
        questionProps = _.merge(questionProps, question.attributes)
      } else {
        console.warn('Error: Malformed question object: ' + question)
        return null
      }

      switch (question.get('type')) {
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
        default: return <Text key={'unknown-question-'+index}>Unknown Type: {question.get('type')}</Text>;
      }
    })
    let buttonText = "Complete survey"
    if(nextForm){
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
          index={0}
          beforePageChange={this.beforePageChange}
          onPageChange={this.onPageChange}
          children={this.renderQuestions()}
          threshold={50}>
        </Swiper>

        // <ScrollView style={Styles.container.form}>
        //   {this.renderQuestions()}
        //   <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
        // </ScrollView>
      )
    }
  }
})

module.exports = FormPage
