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
import Button from 'apsl-react-native-button';

const FormPage = React.createClass ({
  getInitialState() {
    return {}
  },
  submit() {
    let id = "submission_" + Number(new Date());
    // TODO Get geolocation
    AsyncStorage.setItem(id, JSON.stringify({
      id: id,
      formId: 'fakeId',
      date: new Date(),
      answers: this.state
    })).then(()=>{
      this.props.navigator.push({name: 'surveyList'});
    }).catch((error)=>{
      console.log(error);
    });
  },
  render() {
    let questions = this.props.form.questions.map((qId)=>Store.questions[qId]);
    return (<View>
      {questions.map((question)=>{
        switch (question.question_type) {
          case 'shortAnswer': return (<ShortAnswer
            key={question._id}
            question={question}
            onChange={(value)=> this.setState({[question._id]: value})} />);
          default: throw new Exception("Unknown question type.");
        }
      })}
      <Button onPress={this.submit} style={Styles.form.submitBtn}>Submit</Button>
    </View>)
  }
})

module.exports = FormPage
