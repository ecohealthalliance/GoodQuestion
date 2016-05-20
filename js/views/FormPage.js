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

import { loadQuestions, loadCachedQuestions } from '../api/Questions'
import realm from '../data/Realm'

const FormPage = React.createClass ({
  propTypes: {
    form: React.PropTypes.object.isRequired,
    survey: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    let index = 0
    if (this.props.index) {
      index = this.props.index;
    }
    return {
      questions: loadCachedQuestions(this.props.form.id),
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
      .filtered(`formId = "${this.props.form.id}"`)
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
    let formId = this.props.form.id;
    realm.write(() => {
      let submission = realm.create('Submission', {
        formId: formId,
        created: new Date(),
        answers: JSON.stringify(answers),
      });
    });
    this.props.navigator.push({name: 'surveyList', title: 'Surveys'});
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
    try {
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
    newLast = (
      <View>
        {renderedQuestions[renderedQuestions.length-1]}
        <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
      </View>
    )
    renderedQuestions[renderedQuestions.length-1] = newLast
    return renderedQuestions;
  } catch (e) {
    console.error(e)
  }
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
          index={this.state.index}
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
