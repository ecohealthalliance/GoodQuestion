import React, {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ListView,
  Alert,
  RefreshControl,
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
import Icon from 'react-native-vector-icons/FontAwesome'

const SurveyListPage = React.createClass ({
  title: 'Surveys',
  _preventUpdate: false,

  getInitialState() {
    return {
      isLoading: true,
      isRefreshing: false,
      list: loadCachedSurveyList(),
      filteredList: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() {
    this.mountTimeStamp = Date.now()

    // Update Survey List from Parse only once every 3 minutes
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
        if (newPath === 'surveylist') {
          this.loadList()
        }
      }
    } catch(e) {
      console.error(e)
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.navigator) {
      let routeStack = nextProps.navigator.state.routeStack
      let newPath = routeStack[routeStack.length-1].path

      return  newPath === 'surveylist' ||
              this.state.isLoading != nextState.isLoading ||
              this.state.dataSource != nextState.dataSource ||
              this.state.filterType != nextState.filterType ||
              this.state.filteredList != nextState.filteredList

    } else {
      return true
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
          this.setState({isRefreshing: false});
          self.filterList('all', cachedSurveys)
        }
      }, delay)
    }
  },

  filterList(query, list) {
    let filteredList = []

    // Filter the survey by category
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
      isLoading   : false,
      list        : list,
      filteredList: filteredList,
      filterType  : query !== 'all' ? query+' ' : '',
      dataSource  : this.state.dataSource.cloneWithRows(filteredList)
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
  showList(){
    if (this.state.dataSource.getRowCount() > 0) {
      return (
        <ListView dataSource = { this.state.dataSource }
          renderRow = { this.renderItem }
          contentContainerStyle = { [Styles.survey.list] }
          enableEmptySections 
          refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  tintColor="#ff0000"
                  title="Loading..."
                  titleColor="#00ff00"
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor="#ffff00"
                />
              }
        />
      )
    } else {
      return (
        <View style={[Styles.container.attentionContainer]}>
          <Text style={[Styles.container.attentionText]}>
            No {this.state.filterType}surveys
          </Text>
          <TouchableOpacity onPress={() => this.reloadEmpty()}>
              <Icon name="refresh" size={24} color={Color.primary} />
          </TouchableOpacity>
        </View>
      )
    }
  },
  /* Render */
  renderItem(item, sectionId, rowId) {
    if(!item){
      return (<View></View>)
    }
    return (
      <TouchableHighlight
        onPress={() => this.selectSurvey(item)}
        underlayColor={Color.background3}>
        <View>
          <SurveyListItem {...item} getFormAvailability={item.getFormAvailability} />
        </View>
      </TouchableHighlight>
    );
  },
  reloadEmpty(){
    this.setState({isLoading: true});
    loadSurveyList({}, this.loadList);
  },
  _onRefresh() {
    this.setState({isRefreshing: true});
    loadSurveyList({}, this.loadList);
  },
  render() {
    if (this.state.isLoading) {
      return (<Loading/>)
    } else {
      return (
        <View style={[Styles.container.default]}>
          <View style={{flex:1}}>
            {this.showList()}
          </View>
          <SurveyListFilter filterList={this.updateListFilter} />
        </View>
      )
    }
  }
})

module.exports = SurveyListPage
