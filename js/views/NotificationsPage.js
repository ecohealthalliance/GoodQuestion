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
import { loadCachedFormDataById } from '../api/Forms'
import Notification from '../components/Notification'

const NotificationsPage = React.createClass({
  title: 'Notifications',

  getInitialState() {
    // let pendingNotifications = loadNotifications()
    let pendingNotifications = []
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    return {
      list: pendingNotifications,
      dataSource: dataSource.cloneWithRows(pendingNotifications)
    }
  },

  componentDidMount() {
    // this.loadList()
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

    let data = loadCachedFormDataById(notification.formId)
    console.log(data)
    this.props.navigator.push({
      path: 'form',
      title: data.survey.title,
      form: data.form,
      survey: data.survey,
    })
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
