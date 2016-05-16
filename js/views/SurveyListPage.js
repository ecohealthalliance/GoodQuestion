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
import { loadForms } from '../api/Forms'
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
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.list),
    });

    if (this.state.list.length === 0) {
      loadSurveyList({}, this.loadList);
    }
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true
  },

  /* Methods */
  loadList(error, response){
    // Prevent this callback from working if the component has unmounted.
    if (this.cancelCallbacks) return

    if (error) {
      console.warn(error)
    } else {
      if (this.isMounted()) {
        this.setState({
          isLoading: false,
          list: response,
          dataSource: this.state.dataSource.cloneWithRows(response)
        })
      }
    }
  },

  onChecked(rowId) {
    // TODO the checked state should be set when a row is swipped
    return;
  },

  onPress(item) {
    // TODO return the the most recently triggered form that hasn't been filled out.
    loadForms(item, this.selectSurvey)
  },

  selectForm(error, forms, survey) {
    if (this.cancelCallbacks) return

    // TODO Support multiple forms
    if (error) {
      console.warn(error)
    } else if (!forms || !forms[0]) {
      alert('Error: Unable to fetch the Forms associated with this Survey.')
    } else {
      this.props.navigator.push({
        path: 'form',
        title: 'Survey: ' + survey.get('title'),
        form: forms[0],
        survey: survey
      })
    }
  },

  selectSurvey(error, forms, survey) {
    if (this.cancelCallbacks) return

    // TODO Support multiple forms
    if (error) {
      console.warn(error)
    } else if (!forms || !forms[0]) {
      alert('Error: Unable to fetch the Forms associated with this Survey.')
    } else {
      this.props.navigator.push({
        path: 'survey-details',
        title: survey.get('title'),
        forms: forms,
        survey: survey
      })
    }
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
