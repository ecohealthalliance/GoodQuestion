import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import Icon from 'react-native-vector-icons/FontAwesome';

const SurveyListFilter = React.createClass({
  propTypes: {
    filterList: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      activeButton: 'all',
    };
  },

  /* Methods */
  handlePress(filter) {
    this.props.filterList(filter);
    this.setState({
      activeButton: filter,
    });
  },

  /* Render */
  render() {
    return (
      <View style={Styles.survey.listfilter}>
        <SurveyListFilterButton
          active={this.state.activeButton === 'all'}
          onPress={this.handlePress.bind(null, 'all')}
          icon='list-ul'
          >
          All
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'pending'}
          onPress={this.handlePress.bind(null, 'pending')}
          icon='circle-o'
          >
          Pending
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'accepted'}
          onPress={this.handlePress.bind(null, 'accepted')}
          icon='check-circle'
          >
          Accepted
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'declined'}
          onPress={this.handlePress.bind(null, 'declined')}
          icon='times-circle'
          >
          Declined
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'expired'}
          onPress={this.handlePress.bind(this, 'expired')}
          icon='stop-circle-o'
          >
          Expired
        </SurveyListFilterButton>
      </View>
    );
  },
});

const SurveyListFilterButton = React.createClass({
  propTypes: {
    active: React.PropTypes.bool.isRequired,
    icon: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired,
  },
  render() {
    const buttonContainerStyle = {opacity: 0.5};
    let buttonViewStyle = {flex: 1, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'};
    if (this.props.active) {
      buttonContainerStyle.opacity = 1;
    }
    return (
      <View style={[buttonContainerStyle]}>
        <TouchableWithoutFeedback onPress={this.props.onPress} >
          <View style={buttonViewStyle}>
            <Icon name={this.props.icon} size={24} color={Color.primary} />
            <Text style={{flex: 1, fontSize: 10}}>{this.props.children}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
});

module.exports = SurveyListFilter;
