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
import Styles from '../styles/Styles'
import { loadNotifications } from '../api/Notifications'
import Notification from '../components/Notification'

const NotificationsPage = React.createClass({
  title: 'Notifications',

  getInitialState() {
    return {
      list: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentDidMount() {
    this.loadList()
  },

  componentWillUnmount() {
    this.cancelCallbacks = true
  },

  /* Methods */
  loadList(error, response){
    if (error) {
      console.warn(error)
    } else {
      let pendingNotifications = loadNotifications()
      if (!this.cancelCallbacks) {
        this.setState({
          list: pendingNotifications,
          dataSource: this.state.dataSource.cloneWithRows(pendingNotifications)
        })
      }
    }
  },

  selectNotification(notification) {
    if (this.cancelCallbacks) return
    navigateToForm(notification.formId)
  },

  /* Render */
  renderItem(item, sectionId, rowId) {
    return (
      <Notification item={item} onPressed={this.selectNotification.bind(this, item)} />
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

module.exports = NotificationsPage
