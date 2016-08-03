import React from 'react';
import {
  View,
  ListView,
} from 'react-native';

import Styles from '../styles/Styles';
import { loadNotifications } from '../api/Notifications';
import { loadCachedFormDataById } from '../api/Forms';
import FormListItem from '../components/FormListItem';

const FormListPage = React.createClass({
  title: 'Forms',

  propTypes: {
    survey: React.PropTypes.object.isRequired,
    forms: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    const forms = this.props.forms;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      list: forms,
      dataSource: dataSource.cloneWithRows(forms),
    };
  },

  componentWillUnmount() {
    this.cancelCallbacks = true;
  },

  /* Methods */
  selectForm(form) {
  },

  /* Render */
  renderItem(item) {
    return (
      <FormListItem {...item} onPressed={this.selectForm.bind(null, item)} />
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

module.exports = FormListPage;
