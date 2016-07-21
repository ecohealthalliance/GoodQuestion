import React, {
  Alert,
  View,
  ListView,
} from 'react-native';

import Styles from '../styles/Styles';
import { loadNotifications, markNotificationsAsViewed, clearNotifications } from '../api/Notifications';
import { loadCachedFormDataById } from '../api/Forms';
import Button from '../components/Button';
import Notification from '../components/Notification';

const NotificationsPage = React.createClass({
  title: 'Notifications',

  getInitialState() {
    let pendingNotifications = loadNotifications();
    pendingNotifications = [...pendingNotifications, ...pendingNotifications, ...pendingNotifications, ...pendingNotifications, ...pendingNotifications]
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      list: pendingNotifications,
      dataSource: dataSource.cloneWithRows(pendingNotifications),
    };
  },

  componentDidMount() {
    markNotificationsAsViewed(this.state.list);
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

  handleClear() {
    Alert.alert('Confirm', 'Are you sure you would like to clear ALL notifications?', [
      {text: 'Cancel', onPress: () => { }, style: 'cancel' },
      {text: 'OK', onPress: () => {
        const currentNotifications = this.state.list;
        this.setState({
          list: [],
          dataSource: this.state.dataSource.cloneWithRows([]),
        }, () => {
          clearNotifications(currentNotifications);
        });
      }},
    ]);
  },

  /* Render */
  renderItem(item) {
    return (
      <Notification item={item} onPressed={this.selectNotification.bind(this, item)} />
    );
  },

  render() {
    return (
      <View style={[Styles.container.default, {flex: 1}]}>
        <View style={{flex: 1, paddingBottom: 60}}>
          <ListView dataSource = { this.state.dataSource }
            renderRow = { this.renderItem }
            contentContainerStyle = { [Styles.container.default, Styles.survey.list, {flex: 0}] }
            enableEmptySections
          />
        </View>
        <Button
          action={this.handleClear}
          style={Styles.form.footerButton}
          textStyle={[Styles.form.registerText, Styles.form.registerTextActive]}>
          Clear
        </Button>
      </View>
    );
  },
});

module.exports = NotificationsPage;
