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
import DateQuestionIOS from '../components/QuestionTypes/DateQuestionIOS'
import DateQuestionAndroid from '../components/QuestionTypes/DateQuestionAndroid'
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
      answers: {}
    }
  },

  componentWillMount() {
    let id = this.genSubmissionKey();
    AsyncStorage.getItem(id, (err, res) => {
      if (res) {
        let submission = JSON.parse(res);
        this.setState({answers: submission.answers})
      }
    });
    loadQuestions(this.props.form, this.setQuestions)
  },

  /* Methods */
  genSubmissionKey() {
    return "submission:" + this.props.survey.id + ":" + this.props.form.id;
  },

  setQuestions(error, response) {
    if (error) {
      console.warn(error)
    } else {
      this.setState({
        questions: response
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
      console.log(error);
    });
  },

  /* Render */

  renderQuestions() {
    return this.state.questions.map((question, index)=>{
      console.log(Platform.OS)
      let questionProps = {
        key: question.id,
        id: question.id,
        value: this.state.answers[question.id],
        onChange: (value)=> this.setState({[question.id]: value}),
      }

      if (question.attributes) {
        questionProps = _.merge(questionProps, question.attributes)
      } else {
        console.warn('Error: Malformed question object: ' + question)
        return null
      }
      
      switch (question.get('questionType')) {
        case 'shortAnswer': return (<ShortAnswer
          key={question.id}
          question={question}
          value={this.state.answers[question.id]}
          onChange={(value)=> this.setState({[question.id]: value})} />);
        case 'checkboxes': return (<Checkboxes
          key={question.id}
          question={question}
          value={this.state.answers[question.id]}
          onChange={(value)=> this.setState({[question.id]: value})} />);

        case 'multipleChoice': return (<MultipleChoice
          key={question.id}
          question={question}
          value={this.state.answers[question.id]}
          onChange={(value)=> this.setState({[question.id]: value})} />);

        case 'date':
          return Platform.OS === 'ios' ?
            <DateQuestionIOS {...questionProps} /> : 
            <DateQuestionAndroid {...questionProps} />

        default: return <Text key={'unknown-question-'+index}>Unknown Type: {question.get('questionType')}</Text>;
      }
    })
  },

  render() {
    return (
      <ScrollView style={Styles.container.form}>
        {this.renderQuestions()}
        <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
      </ScrollView>
    )
  }
})

module.exports = FormPage
