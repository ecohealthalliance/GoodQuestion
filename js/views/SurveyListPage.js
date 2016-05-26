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
import Color from '../styles/Color'

const SurveyListPage = React.createClass ({
  title: 'Surveys',

  getInitialState() {
    return {
      isLoading: true,
      list: loadCachedSurveyList(),
      filteredList: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() {
    this.mountTimeStamp = Date.now()

    // Update Survey List from Parse once every 3 minutes
    if ( this.state.list.length === 0 || Store.lastParseUpdate + 180000 < Date.now() ) {
      loadSurveyList({}, this.loadList);
    } else {
      this.loadList()
    }
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true
  },

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.navigator) {
        let routeStack = nextProps.navigator.state.routeStack
        let newPath = routeStack[routeStack.length-1].path
        if (newPath === 'surveylist') this.loadList()
      }
    } catch(e) {
      console.error(e)
    }
  },

  /* Methods */
  loadList(error, response){
    // Prevent this callback from working if the component has unmounted.
    if (this.cancelCallbacks) return

    if (error) {
      console.warn(error)
      this.filterList('all', [])
    } else {
      let self = this
      // Use the Realm cached versions to determine accept/decline status
      let cachedSurveys = loadCachedSurveyList()

      let delay = 0
      if (this.mountTimeStamp + 750 > Date.now()) delay = 750

      setTimeout(() => {
        if (!self.cancelCallbacks) {
          self.filterList('all', cachedSurveys)
        }
      }, delay)
    }
  },

  filterList(query, list) {
    let filteredList = []
    if (query !== 'all') {
      for (var i = 0; i < list.length; i++) {
        if (list[i].status == query) {
          filteredList.push(list[i])
        }
      }
    } else {
      filteredList = list
    }
    this.setState({
      isLoading: false,
      list: list,
      filteredList: filteredList,
      dataSource: this.state.dataSource.cloneWithRows(filteredList)
    })
  },

  updateListFilter(query) {
    this.filterList(query, this.state.list)
  },

  onChecked(rowId) {
    // TODO the checked state should be set when a row is swipped
    return;
  },

  selectSurvey(survey) {
    if (this.cancelCallbacks) return
    if (survey.getForms().length === 0) {
      return Alert.alert('Survey has no active forms.')
    }
    // TODO Support multiple forms
    let path = 'survey-details'
    if (survey.status == 'accepted') {
        path = 'form'
    }
    this.props.navigator.push({
      path: path,
      title: survey.title,
      survey: survey
    })
  },

  /* Render */
  renderItem(item, sectionId, rowId) {
    return (
      <TouchableHighlight
        onPress={() => this.selectSurvey(item)}
        underlayColor={Color.background3}>
        <View>
          <SurveyListItem item={item} onChecked={this.onChecked.bind(this, rowId)} />
        </View>
      </TouchableHighlight>
    );
  },

  render() {
    if (this.state.isLoading) {
      return (<Loading/>)
    } else {
      return (
        <View style={[Styles.container.default , {flex: 1}]}>
          {
            this.state.dataSource.getRowCount() > 0 ?
            <ListView dataSource = { this.state.dataSource }
              renderRow = { this.renderItem }
              contentContainerStyle = { [Styles.container.default, Styles.survey.list] }
              enableEmptySections
            />
            :
            <View style={[Styles.container.attentionContainer]}>
              <Text style={[Styles.container.attentionText]}>No surveys available.</Text>
            </View>
          }
          <SurveyListFilter filterList={this.updateListFilter} />
        </View>
      )
    }
  }
})

module.exports = SurveyListPage
