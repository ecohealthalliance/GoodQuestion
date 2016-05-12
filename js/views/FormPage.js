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

import { loadQuestions } from '../api/Questions'


const FormPage = React.createClass ({
  propTypes: {
    form: React.PropTypes.object.isRequired,
    survey: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      questions: [],
      answers: {},
      loading: true,
    }
  },

  componentWillMount() {
    this.props.setTitle("Survey: " + this.props.survey.get('title'));
    let id = this.genSubmissionKey();
    AsyncStorage.getItem(id, (err, res) => {
      if (res) {
        let submission = JSON.parse(res);
        this.setState({answers: submission.answers})
      }
    });
    loadQuestions(this.props.form, this.setQuestions)
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true
  },

  /* Methods */
  genSubmissionKey() {
    return "submission:" + this.props.survey.id + ":" + this.props.form.id;
  },

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
    let id = this.genSubmissionKey();
    // TODO Get geolocation
    AsyncStorage.setItem(id, JSON.stringify({
      id: id,
      formId: this.props.form.id,
      date: new Date(),
      answers: this.state,
    })).then(()=>{
      this.props.navigator.push({name: 'surveyList'});
    }).catch((error)=>{
      console.error(error);
    });
  },

  /* Render */

  renderQuestions() {
    return this.state.questions.map((question, index)=>{
      let questionProps = {
        key: question.id,
        id: question.id,
        value: this.state.answers[question.id],
        onChange: (value)=> {
          console.log(value)
          this.setState({[question.id]: value})
        },
      }

      if (question.attributes) {
        questionProps = _.merge(questionProps, question.attributes)
      } else {
        console.warn('Error: Malformed question object: ' + question)
        return null
      }
      
      switch (question.get('questionType')) {
        case 'shortAnswer': return <ShortAnswer {...questionProps} />
        case 'checkboxes': return <Checkboxes {...questionProps} />
        case 'multipleChoice': return <MultipleChoice {...questionProps} />
        case 'longAnswer': return <LongAnswerQuestion {...questionProps} />
        case 'number': return <NumberQuestion {...questionProps} />
        case 'scale': return <ScaleQuestion {...questionProps} />
        case 'date':
          return Platform.OS === 'ios' ?
            <DateQuestionIOS {...questionProps} /> : 
            <DateQuestionAndroid {...questionProps} />
        case 'datetime':
          return Platform.OS === 'ios' ?
            <DateQuestionIOS {...questionProps} mode="datetime" /> : 
            <DatetimeQuestionAndroid {...questionProps} />

        default: return <Text key={'unknown-question-'+index}>Unknown Type: {question.get('questionType')}</Text>;
      }
    })
  },

  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text style={Styles.type.h1}>Loading questions...</Text>
        </View>
      )
    } else {
      return (
        <ScrollView style={Styles.container.form}>
          {this.renderQuestions()}
          <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
        </ScrollView>
      )
    }
  }
})

module.exports = FormPage
