import React, {
  View,
  Platform,
  Navigator,
  BackAndroid,
  TouchableOpacity,
  Text,
} from 'react-native'

import Drawer from 'react-native-drawer'

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
import {isAuthenticated} from '../api/Account'


// Views
import LoginPage from '../views/LoginPage'
import SurveyListPage from '../views/SurveyListPage'
import TermsOfServicePage from '../views/TermsOfServicePage'
import RegistrationPagePart1 from '../views/RegistrationPagePart1'
import RegistrationPagePart2 from '../views/RegistrationPagePart2'
import RegistrationPagePart3 from '../views/RegistrationPagePart3'
import RegistrationPagePart4 from '../views/RegistrationPagePart4'
import SurveyDetailsPage from '../views/SurveyDetailsPage'
import FormPage from '../views/FormPage'
import ControlPanel from '../views/ControlPanel'

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
      drawerOpen: false
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

  /* Methods */
  setAuthenticated(authenticated) {
    let state = Object.assign({}, this.state);
    state.isAuthenticated = authenticated;
    this.setState(state);
  },

  /* Render */
  routeMapper(route, nav) {
    // we secure all routes
    if (!this.state.isAuthenticated) {
      route.path = 'login'
      route.title = 'Good Question'
    }
    switch (route.path) {
      case 'login': return <LoginPage navigator={nav} setAuthenticated={this.setAuthenticated} />
      case 'surveylist': return <SurveyListPage navigator={nav} />
      case 'terms': return <TermsOfServicePage navigator={nav} />
      case 'registration1': return <RegistrationPagePart1 navigator={nav} />
      case 'registration2': return <RegistrationPagePart2 navigator={nav} />
      case 'survey-details': return <SurveyDetailsPage navigator={nav} forms={route.forms} survey={route.survey} />
      case 'form': return <FormPage navigator={nav} form={route.form} survey={route.survey} />
      default: return <SurveyListPage navigator={nav} />
    }
  },
  render() {
    const initialRoute = { path: 'surveylist', title: 'Surveys' }
    // show loading component without the navigationBar
    if (this.state.isLoading) {
      return (<Loading/>);
    }
    // show the navigator
    return (
      <Drawer
        type="overlay"
        content={<ControlPanel
          navigator={navigator}
          closeDrawer={()=>this.setState({drawerOpen: false})} />}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={Styles.drawer}
        open={this.state.drawerOpen}
        onClose={()=>this.setState({drawerOpen: false})}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
        >
        <Navigator
          ref={(nav) => { navigator = nav }}
          initialRoute={initialRoute}
          renderScene={this.routeMapper}
          configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
          style={Styles.container.wrapper}
          navigationBar={
            <Header
              title={this.state.title}
              openDrawer={()=>this.setState({drawerOpen: true})} />
          }
        />
      </Drawer>
    );
  }
})

module.exports = SharedNavigator
