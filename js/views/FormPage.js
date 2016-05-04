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
  },
  genSubmissionKey() {
   return "submission:" + this.props.survey.objectId + ":" + this.props.form.objectId;
 },
  getInitialState() {
    return {answers: {}}
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
  submit() {
    let id = this.genSubmissionKey();
    // TODO Get geolocation
    AsyncStorage.setItem(id, JSON.stringify({
      id: id,
      formId: this.props.form.objectId,
      date: new Date(),
      answers: this.state,
    })).then(()=>{
      this.props.navigator.push({name: 'surveyList'});
    }).catch((error)=>{
      console.log(error);
    });
  },
  render() {
    let questions = this.props.form.questions.map(function(qId) {
       return Store.questions.find((q) => q.objectId === qId);
    });
    return (<View style={Styles.container.form}>
      {questions.map((question)=>{
        switch (question.questionType) {
          case 'inputText': return (<ShortAnswer
            key={question.objectId}
            question={question}
            value={this.state.answers[question.objectId]}
            onChange={(value)=> this.setState({[question.objectId]: value})} />);
          case 'checkboxes': return (<Checkboxes
            key={question.objectId}
            question={question}
            value={this.state.answers[question.objectId]}
            onChange={(value)=> this.setState({[question.objectId]: value})} />);
          case 'multipleChoice': return (<MultipleChoice
            key={question.objectId}
            question={question}
            value={this.state.answers[question.objectId]}
            onChange={(value)=> this.setState({[question.objectId]: value})} />);
          default: return;
        }
      })}
      <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
    </View>)
  }
})

module.exports = FormPage
