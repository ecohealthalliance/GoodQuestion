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
      dataSource: this.state.dataSource.cloneWithRows(Store.surveys)
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
        contentContainerStyle = { [Styles.container.default, Styles.survey.list] }
        enableEmptySections
      />
    )
  }
})

module.exports = SurveyListPage
