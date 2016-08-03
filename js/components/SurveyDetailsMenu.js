import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Styles from '../styles/Styles';
import Color from '../styles/Color';

import Icon from 'react-native-vector-icons/FontAwesome';

const SurveyDetailsMenu = React.createClass({
  propTypes: {
    changeTab: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      activeButton: 'survey',
    };
  },

  /* Methods */
  handlePress(tab) {
    this.props.changeTab(tab);
    this.setState({
      activeButton: tab,
    });
  },

  /* Render */
  render() {
    return (
      <View style={Styles.survey.listfilter}>
        <SurveyListFilterButton
          active={this.state.activeButton === 'survey'}
          onPress={this.handlePress.bind(null, 'survey')}
          icon='check-circle'
          >
          Survey
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'forms'}
          onPress={this.handlePress.bind(null, 'forms')}
          icon='list-ul'
          >
          Forms
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'scheduled'}
          onPress={this.handlePress.bind(null, 'scheduled')}
          icon='clock-o'
          >
          Scheduled
        </SurveyListFilterButton>
        <SurveyListFilterButton
          active={this.state.activeButton === 'geofence'}
          onPress={this.handlePress.bind(null, 'geofence')}
          icon='map-marker'
          >
          Geofence
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
    let buttonViewStyle = {flex: 1, width: 70, paddingVertical: 12, justifyContent: 'center', alignItems: 'center'};
    if (this.props.active) {
      buttonContainerStyle.opacity = 1;
    }

    return (
      <View style={[buttonContainerStyle]}>
        <TouchableOpacity onPress={this.props.onPress} >
          <View style={buttonViewStyle}>
            <Icon name={this.props.icon} size={24} color={Color.primary} />
            <Text style={{flex: 1, fontSize: 10}}>{this.props.children}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
});


module.exports = SurveyDetailsMenu;
