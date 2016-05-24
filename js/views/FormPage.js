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
import { loadCachedForms } from '../api/Forms'

import { loadQuestions, loadCachedQuestions } from '../api/Questions'
import realm from '../data/Realm'

const FormPage = React.createClass ({
  propTypes: {
    // forms: React.PropTypes.array.isRequired,
    survey: React.PropTypes.object.isRequired,
    // index: React.PropTypes.number.isRequired
  },

  getInitialState() {
    forms = loadCachedForms(this.props.survey.id)
    // this.realm = new Realm({schema: [Submission]});
    index = 0
    if (this.props.index) {
      index = this.props.index;
    }
    form = forms[index]
    nextForm = forms[index + 1]
    return {
      questions: loadCachedQuestions(form.id),
      answers: {},
      loading: false,
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
    let submissions = realm
      .objects('Submission')
      .filtered(`formId = "${form.id}"`)
      .sorted('created');
    if(submissions.length > 0) {
      this.setState({answers: JSON.parse(submissions.slice(-1)[0].answers)})
    }    
  },

  componentWillUnmount() {
    this.cancelCallbacks = true
  },

  /* Methods */

  submit() {
    // TODO Get geolocation
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

  onPageChange(page) {
    this.setState({
      index: page
    });
  },

  /* Render */

  renderQuestions() {
    // questArray = Array(this.state.questions[0])
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
        default: return <Text key={'unknown-question-'+index}>Unknown Type: {question.type}</Text>;
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
  // } catch (e) {
  //   console.error(e)
  // }
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
      )
    }
  }
})

module.exports = FormPage
