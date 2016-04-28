
import React, {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
} from 'react-native'

import _ from 'lodash'
import Store from '../data/Store'
import Styles from '../styles/Styles'

import CheckBox from 'react-native-checkbox'

const SurveyListPage = React.createClass ({
  title: 'Surveys',
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },
  componentDidMount() {
    this.props.setTitle(this.title);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(Store.surveys),
    })
  },

  /* Methods */
  onChecked(rowId) {
    let newSource = Store.surveys.slice();
    let oldItem = Store.surveys[rowId];
    oldItem.accepted = !oldItem.accepted;
    newSource[rowId] = Object.assign({}, oldItem);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newSource),
    });
  },

  /* Render */
  renderItem(item, sectionId, rowId) {
    return (
      <View style={Styles.survey.listitem}>
        <View style={Styles.container.col75}>
          <Text style={Styles.survey.title}>{item.title}</Text>
          <Text style={Styles.survey.subtitle}>A subtitle</Text>
        </View>
        <View style={[Styles.container.col25, {alignItems: 'flex-end'}]}>
          <CheckBox
            ref={item.objectId}
            checked={item.accepted}
            checkImage={require('react-native-checkbox/example-custom-check.png')}
            onChange={this.onChecked.bind(this, rowId)}
            style={Styles.survey.acceptedCheckbox}
          />
        </View>
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
