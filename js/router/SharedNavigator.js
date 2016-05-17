import React, {
  View,
  Platform,
  Navigator,
  BackAndroid,
  TouchableOpacity,
  Text,
} from 'react-native'

import Settings from '../settings'

// Components
import Header from '../components/Header'
import Loading from '../components/Loading'

// Styles
import Styles from '../styles/Styles'

// Model
import Store from '../data/Store'

// Parse
import Parse from 'parse/react-native'
import {connectToParseServer} from '../api/ParseServer'
import {isAuthenticated, register} from '../api/Account'


// Views
import LoginPage from '../views/LoginPage'
import SurveyListPage from '../views/SurveyListPage'
import TermsOfServicePage from '../views/TermsOfServicePage'
import RegistrationPages from '../views/RegistrationPages'
import FormPage from '../views/FormPage'

/* Configuration */
if (Platform.OS === 'ios') {
  Store.platform = 'ios'
} else {
  Store.platform = 'android'
}


let navigator
// Binds the hardware "back button" from Android devices
if ( Platform.OS === 'android' ) {
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }
    return false;
  });
}

const SharedNavigator = React.createClass ({
  getInitialState() {
    return {
      title: '',
      isLoading: true,
      isAuthenticated: false,
    }
  },
  componentWillMount() {
    connectToParseServer(Settings.parse.serverUrl, Settings.parse.appId);
  },
  componentDidMount() {
    let self = this;
    isAuthenticated(function(authenticated) {
      let state = Object.assign({}, self.state);
      state.isAuthenticated = authenticated;
      state.isLoading = false;
      self.setState(state);
    });
  },
  setTitle(title) {
    let state = Object.assign({}, this.state);
    state.title = title;
    this.setState(state);
  },
  setAuthenticated(authenticated) {
    let state = Object.assign({}, this.state);
    state.isAuthenticated = authenticated;
    this.setState(state);
  },
  routeMapper(route, nav) {
    let sharedProps = {
      navigator: nav,
      setTitle: this.setTitle,
    };

    if (!this.state.isAuthenticated && !route.unsecured) {
      return <LoginPage {...sharedProps} setAuthenticated={this.setAuthenticated} />
    }
    switch (route.name) {
      case 'login': return <LoginPage {...sharedProps} setAuthenticated={this.setAuthenticated} />
      case 'surveylist': return <SurveyListPage {...sharedProps} />
      case 'terms': return <TermsOfServicePage {...sharedProps} />
      case 'registration': return <RegistrationPages {...sharedProps} index={route.index} />
      case 'form': return <FormPage {...sharedProps} form={route.form} survey={route.survey} />
      default: return <SurveyListPage {...sharedProps} />
    }
  },
  render() {
    const initialRoute = {name: 'surveylist'}
    // show loading component without the navigationBar
    if (this.state.isLoading) {
      return (<Loading/>);
    }
    // show the navigator
    return (
      <Navigator
        ref={(nav) => { navigator = nav }}
        initialRoute={initialRoute}
        renderScene={this.routeMapper}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
        style={Styles.container.wrapper}
        navigationBar={
          <Header title={this.state.title} />
        }
      />
    );
  }
})

module.exports = SharedNavigator
