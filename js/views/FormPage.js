import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ListView,
  AsyncStorage
} from 'react-native'

import Store from '../data/Store'
import Styles from '../styles/Styles';
import ShortAnswer from '../components/QuestionTypes/ShortAnswer';
import Checkboxes from '../components/QuestionTypes/Checkboxes';
import MultipleChoice from '../components/QuestionTypes/MultipleChoice';
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
        default: return <Text key={'unknown-question-'+index}>Unknown Question Type</Text>;
      }
    })
  },

  render() {
    
    console.log('QUESTIONS:')
    console.log(this.state.questions)
    return (
      <View style={Styles.container.form}>
        {this.renderQuestions()}
        <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
      </View>
    )
  }
})

module.exports = FormPage
