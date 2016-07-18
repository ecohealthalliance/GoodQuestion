import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ListView,
} from 'react-native';

import Styles from '../styles/Styles';
import { loadNotifications } from '../api/Notifications';
import { loadCachedFormDataById } from '../api/Forms';
import Notification from '../components/Notification';

const NotificationsPage = React.createClass({
  title: 'Notifications',

  getInitialState() {
    const pendingNotifications = loadNotifications();
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      list: pendingNotifications,
      dataSource: dataSource.cloneWithRows(pendingNotifications),
    };
  },

  componentDidMount() {
    // this.loadList()
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  /* Methods */
  loadList(error) {
    if (error) {
      console.warn(error);
    } else {
      const pendingNotifications = loadNotifications();
      if (!this.cancelCallbacks) {
        this.setState({
          list: pendingNotifications,
          dataSource: this.state.dataSource.cloneWithRows(pendingNotifications),
        });
      }
    }
  },

  selectNotification(notification) {
    if (this.cancelCallbacks) {
      return;
    }

    const data = loadCachedFormDataById(notification.formId);
    if (typeof data === 'undefined' || typeof data.survey === 'undefined' || typeof data.form === 'undefined') {
      return;
    }
    this.props.navigator.push({
      path: 'form',
      title: data.survey.title,
      form: data.form,
      survey: data.survey,
    });
  },

  /* Render */
  renderItem(item) {
    return (
      <Notification item={item} onPressed={this.selectNotification.bind(null, item)} />
    );
  },

  render() {
    return (
      <View style={[Styles.container.default, {flex: 1}]}>
        <ListView dataSource = { this.state.dataSource }
          renderRow = { this.renderItem }
          contentContainerStyle = { [Styles.container.default, Styles.survey.list, {flex: 0}] }
          enableEmptySections
        />
      </View>
    );
  },
});

module.exports = NotificationsPage;
