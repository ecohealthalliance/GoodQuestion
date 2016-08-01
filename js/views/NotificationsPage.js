import React, {
  Alert,
  View,
  ListView,
} from 'react-native';

import Styles from '../styles/Styles';
import { loadUserNotifications, markNotificationsAsViewed, clearNotifications, clearNotification } from '../api/Notifications';
import { loadCachedFormDataById } from '../api/Forms';
import Button from '../components/Button';
import Notification from '../components/Notification';
import Loading from '../components/Loading';

const NotificationsPage = React.createClass({
  title: 'Notifications',

  getInitialState() {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      loading: true,
      list: [],
      dataSource: dataSource.cloneWithRows([]),
    };
  },

  componentDidMount() {
    this.loadList();
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  /* Methods */
  loadList() {
    loadUserNotifications({}, (err, notifications) => {
      if (err) {
        console.warn(err);
        this.setState({ loading: false });
        return;
      }
      if (!this.cancelCallbacks) {
        this.setState({
          loading: false,
          list: notifications,
          dataSource: this.state.dataSource.cloneWithRows(notifications),
        });
        markNotificationsAsViewed(notifications);
      }
    });
  },

  selectNotification(notification) {
    if (this.cancelCallbacks) {
      return;
    }

    const data = loadCachedFormDataById(notification.formId);
    if (typeof data === 'undefined' || typeof data.survey === 'undefined' || typeof data.form === 'undefined') {
      return;
    }

    clearNotification(notification);
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
    if (this.state.loading) {
      return <Loading/>;
    }
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
