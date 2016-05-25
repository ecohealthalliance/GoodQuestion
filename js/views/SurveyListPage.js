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
import { loadSurveyList, loadCachedSurveyList } from '../api/Surveys'
import { loadForms } from '../api/Forms'
import SurveyListItem from '../components/SurveyListItem'
import SurveyListFilter from '../components/SurveyListFilter'
import Loading from '../components/Loading'

const SurveyListPage = React.createClass ({
  title: 'Surveys',

  getInitialState() {
    return {
      isLoading: true,
      list: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() {
    this.mountTimeStamp = Date.now()

    if (this.state.list.length === 0) {
      loadSurveyList({}, this.loadList);
    }
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true
  },

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.navigator) {
        let newPath = nextProps.navigator.state.routeStack[nextProps.navigator.state.routeStack.length-1].path
        if (newPath === 'surveylist') this.loadList()
      }
    } catch(e) {
      console.error(e)
    }
  },

  /* Methods */
  loadList(error, response){
    console.log('loading list...')
    // Prevent this callback from working if the component has unmounted.
    if (this.cancelCallbacks) return

    if (error) {
      console.warn(error)
    } else {
      let self = this
      // Use the Realm cached versions to determine accept/decline status
      let cachedSurveys = loadCachedSurveyList()

      let delay = 0
      if (this.mountTimeStamp + 750 > Date.now()) delay = 750

      setTimeout(() => {
        console.log('loading timeout')
        if (!self.cancelCallbacks) {
          console.log('loading setstate')
          self.setState({
            isLoading: false,
            list: cachedSurveys,
            dataSource: self.state.dataSource.cloneWithRows(cachedSurveys)
          })
        }
      }, delay)
    }
  },

  onChecked(rowId) {
    // TODO the checked state should be set when a row is swipped
    return;
  },

  onPress(item) {

    // TODO return the most recently triggered form that hasn't been filled out.
    this.selectSurvey(item)
  },

  selectSurvey(survey) {
    if (this.cancelCallbacks) return
    // TODO Support multiple forms
    this.props.navigator.push({
      path: 'survey-details',
      title: survey.title,
      survey: survey
    })
  },

  filterList() {

  },

  /* Render */
  renderItem(item, sectionId, rowId) {
    return (
      <SurveyListItem item={item} onPressed={this.onPress.bind(this, item)} onChecked={this.onChecked.bind(this, rowId)} />
    );
  },

  render() {
    if (this.state.isLoading) {
      return (<Loading/>)
    } else {
      return (
        <View>
          <ListView dataSource = { this.state.dataSource }
            renderRow = { this.renderItem }
            contentContainerStyle = { [Styles.container.default, Styles.survey.list] }
            enableEmptySections
          />
          <SurveyListFilter filterList={this.filterList} />
        </View>
      )
    }
  }
})

module.exports = SurveyListPage
