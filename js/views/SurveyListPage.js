import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
} from 'react-native'

import Parse from 'parse/react-native'
import Store from '../data/Store'
import Styles from '../styles/Styles'

import { loadSurveyList } from '../api/Surveys'

const SurveyListPage = React.createClass({
  mixins: [ParseReact.Mixin], // Enable query subscriptions

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
    let surveyList = this.data.surveys ? this.data.surveys : []
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(Store.surveys)
    })

    loadSurveyList({}, this.loadList)
  },

  /* Methods */
  loadList(error, response){
    if (error) {
      console.warn(error)
    } else {
      console.log('loadList')
      console.log(response)
      this.setState({
        isLoading: false,
        list: response,
        dataSource: this.state.dataSource.cloneWithRows(response)
      })
    }
  },

  /* Render */

  renderItem(item) {
    return ( 
      <View style = { Styles.survey.listitem } >
        <Text style = { Styles.type.p } > { item.attributes.title } </Text> 
      </View>
    )
  },

  render() {
    return ( 
      <ListView dataSource = { this.state.dataSource }
        renderRow = { this.renderItem }
        contentContainerStyle = {
        [Styles.container.default, Styles.survey.list] }
      />
    )
  }
})

module.exports = SurveyListPage
