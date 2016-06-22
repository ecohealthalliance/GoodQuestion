import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ListView,
  Alert,
  RefreshControl,
} from 'react-native'

import _ from 'lodash'
import Store from '../data/Store'
import Styles from '../styles/Styles'
import { loadSurveyList, loadCachedSurveyList } from '../api/Surveys'
import { loadForms, loadActiveGeofenceFormsInRange } from '../api/Forms'
import { loadCachedQuestionsFromForms } from '../api/Questions'
import { InvitationStatus, loadCachedInvitations } from '../api/Invitations'
import SurveyListItem from '../components/SurveyListItem'
import SurveyListFilter from '../components/SurveyListFilter'
import Loading from '../components/Loading'
import Color from '../styles/Color'
import Icon from 'react-native-vector-icons/FontAwesome'


const SurveyListPage = React.createClass ({
  title: 'Surveys',
  _invitations: [],
  _surveys: [],
  getInitialState() {
    return {
      isLoading: true,
      isRefreshing: false,
      hasInvitationChanged: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },

  componentWillMount() {
    this._surveys = loadCachedSurveyList().slice();
    loadCachedInvitations(this._surveys, (err, invitations) => {
      if (err) {
        console.warn(err);
        this._invitations = []
      }
      this._invitations = invitations.slice();
    });
  },

  componentDidMount() {
    this.mountTimeStamp = Date.now()

    // Update Survey List from Parse only once every 3 minutes
    if ( this._surveys.length === 0 || Store.lastParseUpdate + 180000 < Date.now() ) {
      loadSurveyList(this.loadList);
    } else {
      this.loadList()
    }
  },

  componentWillUnmount() {
    // Cancel callbacks
    this.cancelCallbacks = true
  },

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.navigator) {
        let routeStack = nextProps.navigator.state.routeStack
        let newPath = routeStack[routeStack.length-1].path
        if (newPath === 'surveylist') {
          this.loadList()
        }
      }
    } catch(e) {
      console.error(e)
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    if (nextProps.navigator) {
      const routeStack = nextProps.navigator.state.routeStack
      const newPath = routeStack[routeStack.length-1].path
      shouldUpdate = newPath === 'surveylist' ||
              this.state.isLoading != nextState.isLoading ||
              this.state.dataSource != nextState.dataSource ||
              this.state.filterType != nextState.filterType

    }
    return shouldUpdate;
  },

  /* Methods */
  loadList(error, response){
    // Prevent this callback from working if the component has unmounted.
    if (this.cancelCallbacks) return

    const self = this;

    if (error) {
      console.warn(error)
      this.filterList('all')
    } else {
      this._surveys = loadCachedSurveyList().slice();
      loadCachedInvitations(this._surveys, (err, invitations) => {
        if (err) {
          console.warn(err);
          this._invitations = []
        }
        this._invitations = invitations.slice();
        let delay = 0;
        if (this.mountTimeStamp + 750 > Date.now()) delay = 750
        setTimeout(() => {
          if (!self.cancelCallbacks) {
            self.setState({isRefreshing: false});
            self.filterList('all');
          }
        }, delay)
      });

    }
  },

  filterList(query) {
    let filteredList = []

    // Filter the survey by category
    if (query !== 'all') {
      const invitations = _.filter(this._invitations, (invitation) => { return invitation.status === query });
      const surveyIds = _.map(invitations, (invitation) => { return invitation.surveyId });
      filteredList = _.filter(this._surveys, (survey) => { return surveyIds.indexOf(survey.id) >= 0 });
    } else {
      filteredList = this._surveys.slice();
    }

    this.setState({
      isLoading   : false,
      filterType  : query !== 'all' ? query+' ' : '',
      dataSource  : this.state.dataSource.cloneWithRows(filteredList)
    })
  },

  updateListFilter(query) {
    this.filterList(query)
  },

  selectSurvey(survey) {
    if (this.cancelCallbacks) return

    let forms = survey.getForms();
    if (survey.getForms().length === 0) {
      return Alert.alert('Survey has no active forms.')
    }

    let geofenceForms = loadActiveGeofenceFormsInRange(survey.id);
    if (geofenceForms.length > 0) {
      forms = geofenceForms;
      type = 'geofence';
    } else {
      type = 'datetime';
    }

    const invitation = _.find(this._invitations, (invitation) => { return invitation.surveyId === survey.id; });
    if (invitation && invitation.status === 'accepted') {
      this.props.navigator.push({
        path: 'form',
        title: survey.title,
        survey: survey,
        type: type,
      });
    } else {
      const questions = loadCachedQuestionsFromForms(forms);
      this.props.navigator.push({
        path: 'survey-details',
        title: survey.title,
        survey: survey,
        formCount: forms.length,
        questionCount: questions.length,
      })
    }
  },

  showList(){
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
                  tintColor="#ff0000"
                  title="Loading..."
                  titleColor="#00ff00"
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor="#ffff00"
                />
              }
        />
      )
    } else {
      return (
        <View style={[Styles.container.attentionContainer]}>
          <Text style={[Styles.container.attentionText]}>
            No {this.state.filterType}surveys
          </Text>
          <TouchableOpacity onPress={() => this.reloadEmpty()}>
              <Icon name="refresh" size={24} color={Color.primary} />
          </TouchableOpacity>
        </View>
      )
    }
  },

  getInvitationStatus(surveyId) {
    if (this.state.isLoading || this.state.isRefreshing) return;
    let status = InvitationStatus.PENDING;
    let invitation;
    try {
      invitation = _.find(this._invitations, (invitation) => {
        return invitation.surveyId === surveyId;
      });
    } catch(e) {
      console.warn(e);
    }
    if (invitation && invitation.hasOwnProperty('status')) {
      status = invitation.status;
    }
    return status
  },

  /* Render */
  renderItem(survey, sectionId, rowId) {
    if(!survey){
      return (<View></View>)
    }
    return (
      <TouchableHighlight
        onPress={() => this.selectSurvey(survey)}
        underlayColor={Color.background3}>
        <View>
          <SurveyListItem title={survey.title} surveyId={survey.id} status={this.getInvitationStatus(survey.id)} />
        </View>
      </TouchableHighlight>
    );
  },
  reloadEmpty(){
    this.setState({isLoading: true});
    loadSurveyList(this.loadList);
  },
  _onRefresh() {
    this.setState({isRefreshing: true});
    loadSurveyList(this.loadList);
  },
  render() {
    if (this.state.isLoading) {
      return (<Loading/>)
    } else {
      return (
        <View style={[Styles.container.default]}>
          <View style={{flex:1}}>
            {this.showList()}
          </View>
          <SurveyListFilter filterList={this.updateListFilter} />
        </View>
      )
    }
  }
})

module.exports = SurveyListPage
