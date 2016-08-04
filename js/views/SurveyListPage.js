import React from 'react';
import {
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
  ListView,
  RefreshControl,
} from 'react-native';

import _ from 'lodash';
import Styles from '../styles/Styles';
import { loadSurveyList, loadCachedSurveyList } from '../api/Surveys';
import { InvitationStatus, loadCachedInvitations } from '../api/Invitations';
import { cachedSubmissions } from '../api/Submissions';
import SurveyListItem from '../components/SurveyListItem';
import SurveyListFilter from '../components/SurveyListFilter';
import Loading from '../components/Loading';
import Color from '../styles/Color';
import Icon from 'react-native-vector-icons/FontAwesome';

const SurveyListPage = React.createClass({
  title: 'Surveys',
  _invitations: [],
  _surveys: [],
  _incompleteSubmissions: null,

  getInitialState() {
    if (this.props.currentUser) {
      this._incompleteSubmissions = cachedSubmissions.filtered(`userId == "${this.props.currentUser.id}" AND inProgress == true`);
    }
    return {
      isLoading: true,
      isRefreshing: false,
      hasInvitationChanged: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  componentDidMount() {
    this._surveys = loadCachedSurveyList().slice();
    if (this._surveys.length === 0) {
      loadSurveyList(this.loadList);
    } else {
      this.loadList();
    }
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true;
  },

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.navigator) {
        const routeStack = nextProps.navigator.state.routeStack;
        const newPath = routeStack[routeStack.length - 1].path;
        if (newPath === 'surveylist') {
          this.loadList();
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    if (nextProps.navigator) {
      const routeStack = nextProps.navigator.state.routeStack;
      const newPath = routeStack[routeStack.length - 1].path;
      shouldUpdate = newPath === 'surveylist' ||
              this.state.isLoading !== nextState.isLoading ||
              this.state.dataSource !== nextState.dataSource ||
              this.state.filterType !== nextState.filterType;

    }
    return shouldUpdate;
  },

  /**
   * loads the update result from the cache
   *
   * @param {object} err, the error from the callback
   * @param {object} res, the result of the callback
   * note: these res param is not used as the cache is 'reloaded' prior to
   * calling this callback
   */
  loadList(err) {
    // Prevent this callback from working if the component has unmounted.
    if (this.cancelCallbacks) {
      return;
    }
    if (err) {
      // continue processing as we always load from the cache even if the
      // user is 'offline'
      console.warn(err);
    }
    this._surveys = loadCachedSurveyList().slice();
    // loadCachedInvitations is async due to needing the current user
    loadCachedInvitations(this._surveys, (err2, invitations) => {
      if (err2) {
        this._invitations = [];
      } else {
        this._invitations = invitations.slice();
      }
      if (!this.cancelCallbacks) {
        this.filterList('all');
      }
    });
  },

  filterList(query) {
    let filteredList = [];

    // Filter the survey by category
    if (query === 'all') {
      filteredList = this._surveys.slice();
    } else {
      const invitations = _.filter(this._invitations, (invitation) => {
        return invitation.status === query;
      });
      const surveyIds = _.map(invitations, (invitation) => {
        return invitation.surveyId;
      });
      filteredList = _.filter(this._surveys, (survey) => {
        return surveyIds.indexOf(survey.id) >= 0;
      });
    }

    this.setState({
      isLoading: false,
      isRefreshing: false,
      filterType: query === 'all' ? '' : `${query}`,
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
    });

  },

  updateListFilter(query) {
    if (this.state.isLoading || this.state.isRefreshing) {
      return;
    }
    this.filterList(query);
  },

  selectSurvey(survey) {
    if (this.cancelCallbacks) {
      return;
    }

    this.props.navigator.push({
      path: 'survey-details',
      title: survey.title,
      survey: survey,
    });
  },

  showList() {
    if (this.state.dataSource.getRowCount() > 0) {
      return (
        <ListView dataSource = { this.state.dataSource }
          renderRow = { this.renderItem }
          contentContainerStyle = { [Styles.survey.list] }
          enableEmptySections
          refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  tintColor='grey'
                  colors={['grey']}
                />
              }
        />
      );
    }
    return (
      <View style={[Styles.container.attentionContainer]}>
        <Text style={[Styles.container.attentionText]}>
          No {this.state.filterType} surveys
        </Text>
        <TouchableOpacity onPress={() => this.reloadEmpty()}>
            <Icon name='refresh' size={24} color={Color.primary} />
        </TouchableOpacity>
      </View>
    );
  },

  getInvitationStatus(surveyId) {
    if (this.state.isLoading || this.state.isRefreshing) {
      return;
    }
    let status = InvitationStatus.PENDING;
    let invitation = null;
    try {
      invitation = _.find(this._invitations, (inv) => {
        return inv.surveyId === surveyId;
      });
    } catch (e) {
      // this will happen when another async task modifies the _invitations
      // array
      console.warn(e);
      this.props.navigator.resetTo({path: 'surveylist'});
      return;
    }
    if (invitation && invitation.hasOwnProperty('status')) {
      status = invitation.status;
    }
    return status;
  },

  getIncompleteForms(surveyId) {
    if (this.state.isLoading || this.state.isRefreshing || !this._incompleteSubmissions) {
      return;
    }
    return this._incompleteSubmissions.filtered(`surveyId == "${surveyId}"`);;
  },

  /* Render */
  renderItem(survey) {
    if (!survey) {
      return <View></View>;
    }
    return (
      <TouchableHighlight
        onPress={() => this.selectSurvey(survey)}
        underlayColor={Color.background3}>
        <View>
          <SurveyListItem
            title={survey.title}
            key={`survey-item-${survey.id}`}
            surveyId={survey.id}
            status={this.getInvitationStatus(survey.id)}
            incompleteForms={this.getIncompleteForms(survey.id)}
            isRefreshing={this.state.isRefreshing}
            />
        </View>
      </TouchableHighlight>
    );
  },
  reloadEmpty() {
    this.setState({isLoading: true});
    loadSurveyList(this.loadList);
  },
  _onRefresh() {
    this.setState({isRefreshing: true});
    loadSurveyList(this.loadList);
  },
  render() {
    if (this.state.isLoading) {
      return <Loading/>;
    }
    return (
      <View style={[Styles.container.default]}>
        <View style={{flex: 1}}>
          {this.showList()}
        </View>
        <SurveyListFilter filterList={this.updateListFilter} />
      </View>
    );
  },
});

module.exports = SurveyListPage;
