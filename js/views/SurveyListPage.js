import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
  Alert,
} from 'react-native'

import _ from 'lodash'
import Store from '../data/Store'
import Styles from '../styles/Styles'

import { loadSurveyList } from '../api/Surveys'
import SurveyListItem from '../components/SurveyListItem'

const SurveyListPage = React.createClass ({
  title: 'Surveys',

  getInitialState() {
    return {
      isLoading: true,
      list: Store.surveys,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() {
    this.props.setTitle(this.title);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.list),
    })
    
    if (this.state.list.length === 0)
      loadSurveyList({}, this.loadList)
  },

  /* Methods */
  loadList(error, response){
    if (error) {
      console.warn(error)
    } else {
      this.setState({
        isLoading: false,
        list: response,
        dataSource: this.state.dataSource.cloneWithRows(response)
      })
    }
  },

  selectForm(form, survey) {
    // Get Questions
    const self = this
    const formQuestionRelations = form.get('questions')
    formQuestionRelations.query().find({
      success: function(questions) {
        self.props.navigator.push({
          name: 'form',
          form: form,
          survey: survey,
          questions: questions,
        })
      }
    })
  },

  onChecked(rowId) {
    let newSource = Store.surveys.slice();
    let oldItem = Store.surveys[rowId];
    oldItem.accepted = !oldItem.accepted;
    newSource[rowId] = Object.assign({}, oldItem);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newSource),
    });
  },

  onPress(item) {
    // TODO return the the most recently triggered form that hasn't been filled out.
    const self = this
    const surveyFormRelations = item.get('forms')
    surveyFormRelations.query().find({
      success: function(list) {
        if (list[0]) {
          self.selectForm(list[0], item)
        } else {
          Alert.alert('There is no active form for this survey.')
        }
      },
      error: function(list, error) {
        Alert.alert('There is no active form for this survey.')
      }
    })
  },

  /* Render */
  renderItem(item, sectionId, rowId) {
    return (
      <SurveyListItem item={item} onPressed={this.onPress.bind(this, item)} onChecked={this.onChecked.bind(this, rowId)} />
    );
  },

  render() {
    return ( 
      <ListView dataSource = { this.state.dataSource }
        renderRow = { this.renderItem }
        contentContainerStyle = { [Styles.container.default, Styles.survey.list] }
        enableEmptySections
      />
    )
  }
})

module.exports = SurveyListPage
