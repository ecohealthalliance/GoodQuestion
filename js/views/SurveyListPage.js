
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
  Alert,
} from 'react-native'

import Store from '../data/Store'
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
  getActiveForm(survey) {
    // TODO return the the most recently triggered form that hasn't been filled out.
    return Store.forms.form0;
  },
  /* Render */

  renderItem(survey) {
    return (
      <View style={Styles.survey.listitem}>
        <Text
          style={Styles.type.p}
          onPress={()=>{
            let activeForm = this.getActiveForm(survey);
            if(activeForm) {
              this.props.navigator.push({
                name: 'form',
                form: activeForm
              });
            } else {
              Alert.alert("There is no active form for this survey.");
            }
          }}
        >
        {survey.title}
        </Text>
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
