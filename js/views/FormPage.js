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
import Swiper from 'react-native-page-swiper'

import { loadQuestions } from '../api/Questions'
import Realm from 'realm';

const FormPage = React.createClass ({
  propTypes: {
    form: React.PropTypes.object.isRequired,
    survey: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    this.realm = new Realm({schema: [Submission]});
    console.log(this.realm);
    let index = 0
    if (this.props.index) {
      index = this.props.index;
    }
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
      .filtered(`formId = "${this.props.form.id}"`)
      .sorted('created');
    if(submissions.length > 0) {
      this.setState({answers: JSON.parse(submissions.slice(-1)[0].answers)})
    }
    loadQuestions(this.props.form, this.setQuestions)
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
      console.log('setQuestions')
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
    this.setState((prevState)=>{
      prevState.answers[questionId] = value;
      return prevState;
    })
  },

  /* Render */

  renderQuestions() {
    return this.state.questions.map((question, index)=>{
      let questionProps = {
        key: question.id,
        id: question.id,
        value: this.state.answers[question.id],
        index: index + 1,
        onChange: (value)=> {
          this.setAnswer(question.id, value)
        },
      }

      if (question.attributes) {
        questionProps = _.merge(questionProps, question.attributes)
      } else {
        console.warn('Error: Malformed question object: ' + question)
        return null
      }

      switch (question.get('type')) {
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
        default: return <Text key={'unknown-question-'+index}>Unknown Type: {question.get('type')}</Text>;
      }
    })
  },

  getChildren() {
    let pages = [];
    pages.push(<View key="1"><Text>Hello Swiper1!</Text></View>)
    pages.push(<View key="2"><Text>Hello Swiper2!!</Text></View>)
    pages.push(<View key="3"><Text>Hello Swiper3!!!</Text></View>)
    // for (let i = 0; i < totalPages; i++) {
    //   let pageNum = 'page'+i;
    //   if (i === 0) {
    //     pages.push((<View key={i}><RegistrationPagePart1 ref={pageNum} {...this.props} validatePage={this.validatePage} setIndex={this.setIndex} /></View>));
    //   } else if ( i === 1) {
    //     pages.push((<View key={i}><RegistrationPagePart2 ref={pageNum} {...this.props} validatePage={this.validatePage} setIndex={this.setIndex} /></View>));
    //   } else {
    //     pages.push((<View key={i}><RegistrationPagePart3 ref={pageNum} {...this.props} validatePage={this.validatePage} setIndex={this.setIndex} finish={this.finish} /></View>));
    //   }
    // }
    return pages;
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
      console.log('else')
      return (
        <Swiper
          style={{flex: 1}}
          activeDotColor={Color.background1}
          index={this.state.index}
          beforePageChange={this.beforePageChange}
          onPageChange={this.onPageChange}
          children={this.getChildren()}
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
