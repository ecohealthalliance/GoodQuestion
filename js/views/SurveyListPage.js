
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
} from 'react-native'

import Styles from '../../styles/Styles'


const SurveyListPage = React.createClass ({
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  /* Methods */

  /* Render */
  render() {
    return (
      <View>
      </View>
    )
  }
})

const styles = StyleSheet.create({
})

module.exports = SurveyListPage