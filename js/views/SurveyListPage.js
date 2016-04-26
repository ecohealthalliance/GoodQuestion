
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
} from 'react-native'

import Store from '../Store'
import Styles from '../styles/Styles'


const SurveyListPage = React.createClass ({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(Store.surveys)
    })
  },

  /* Methods */

  /* Render */

  renderItem(item) {
    return (
      <View style={Styles.survey.listitem}>
        <Text style={Styles.type.p}>{item.title}</Text>
      </View>
    )
  },

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderItem}
        contentContainerStyle={[Styles.container.default, Styles.survey.list]}
      />
    )
  }
})

module.exports = SurveyListPage