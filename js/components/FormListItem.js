import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import ViewText from './ViewText';
import Icon from 'react-native-vector-icons/FontAwesome';

const FormListItem = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    surveyId: React.PropTypes.string.isRequired,
    trigger: React.PropTypes.object,
    incomplete: React.PropTypes.bool,
  },

  /* Render */
  renderIcon() {
    const { trigger, waiting, incomplete } = this.props;
    let icon = null;
    let color = Color.secondary;

    if (incomplete) {
      return (
        <View style={{paddingTop: 4}}>
          <Icon name='question-circle' size={24} color={Color.positive} />
        </View>
      );
    }

    if (!trigger) {
      return (
        <View style={{paddingTop: 4}}>
          <Icon name='circle-o' size={24} color={Color.secondary} />
        </View>
      );
    } else if (trigger.completed) {
      icon = <Icon name='check-circle' size={24} color={Color.positive} />;
    } else if (trigger.datetime) {
      if (trigger.datetime < Date.now() && !waiting) {
        color = Color.positive;
      }
      icon = <Icon name='clock-o' size={24} color={color} />;
    } else if (trigger.latitude && trigger.longitude) {
      if (trigger.inRange) {
        color = Color.positive;
      }
      icon = <Icon name='map-marker' size={24} color={color} />;
    }

    return (
      <View style={{paddingTop: 4}}>
        {icon}
      </View>
    );
  },

  renderStatusText() {
    const { trigger, waiting, incomplete } = this.props;
    if (!trigger) {
      console.warn('No trigger found');
      return null;
    }

    if (incomplete) {
      return <ViewText textStyle={Styles.survey.itemDescription}>Form available: Incomplete.</ViewText>;
    }

    if (waiting) {
      return <ViewText textStyle={Styles.survey.itemDescription}>Available after form: {waiting}.</ViewText>;
    }

    if (trigger.completed) {
      return <ViewText textStyle={Styles.survey.itemDescription}>Completed.</ViewText>;
    } else if (trigger.datetime) {
      if (trigger.datetime < Date.now()) {
        return <ViewText textStyle={Styles.survey.itemDescription}>Form available.</ViewText>;
      }
      return <ViewText textStyle={Styles.survey.itemDescription}>Scheduled: {moment(trigger.datetime).fromNow()}.</ViewText>;
    } else if (trigger.latitude || trigger.longitude) {
      if (trigger.inRange) {
        return <ViewText textStyle={Styles.survey.itemDescription}>Form in range.</ViewText>;
      }
      return <ViewText textStyle={Styles.survey.itemDescription}>Form out of range.</ViewText>;
    }

    return null;
  },

  render() {
    return (
      <View style={Styles.survey.listitem}>
        <View style={Styles.container.col75}>
          <Text style={Styles.survey.title}>{this.props.title}</Text>
          {this.renderStatusText()}
        </View>
        <View style={[Styles.container.col25, {alignItems: 'flex-end'}]}>
          {this.renderIcon()}
        </View>
      </View>
    );
  },
});

module.exports = FormListItem;
