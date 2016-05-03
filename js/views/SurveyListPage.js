
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

import SurveyListItem from '../components/SurveyListItem'

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
      <SurveyListItem item={item} onChecked={this.onChecked.bind(this, rowId)} />
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
