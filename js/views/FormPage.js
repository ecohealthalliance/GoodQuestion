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
import ShortAnswer from './QuestionTypes/ShortAnswer';
import Checkboxes from './QuestionTypes/Checkboxes';
import MultipleChoice from './QuestionTypes/MultipleChoice';
import Button from 'apsl-react-native-button';

const FormPage = React.createClass ({
  propTypes: {
    form: React.PropTypes.object.isRequired,
    survey: React.PropTypes.object.isRequired,
    questions: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    return {
      questions: {},
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
  },

  /* Methods */
  genSubmissionKey() {
    return "submission:" + this.props.survey.id + ":" + this.props.form.id;
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
  render() {
    let questions = this.props.questions
    console.log(questions)
    return (<View style={Styles.container.form}>
      {questions.map((question)=>{
        switch (question.questionType) {
          case 'inputText': return (<ShortAnswer
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
          default: return;
        }
      })}
      <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
    </View>)
  }
})

module.exports = FormPage
