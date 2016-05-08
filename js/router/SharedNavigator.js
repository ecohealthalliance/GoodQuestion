import React, {
  Platform,
  Navigator,
  BackAndroid,
  TouchableOpacity,
  Text,
} from 'react-native'

// Components
import Header from '../components/Header'

// Styles
import Styles from '../styles/Styles'

// Model
import Store from '../data/Store'

// Views
import LoginPage from '../views/LoginPage'
import SurveyListPage from '../views/SurveyListPage'
import TermsOfServicePage from '../views/TermsOfServicePage'
import RegistrationPagePart1 from '../views/RegistrationPagePart1'
import RegistrationPagePart2 from '../views/RegistrationPagePart2'
import RegistrationPagePart3 from '../views/RegistrationPagePart3'
import RegistrationPagePart4 from '../views/RegistrationPagePart4'
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
    }
  },
  setTitle(title) {
    this.setState({title: title});
  },
  routeMapper(route, nav, onComponentRef) {
    switch (route.name) {
      case 'login': return <LoginPage navigator={nav} setTitle={this.setTitle} />
      case 'surveylist': return <SurveyListPage navigator={nav} setTitle={this.setTitle} />
      case 'terms': return <TermsOfServicePage navigator={nav} setTitle={this.setTitle} />
      case 'registration1': return <RegistrationPagePart1 navigator={nav} setTitle={this.setTitle} />
      case 'registration2': return <RegistrationPagePart2 navigator={nav} setTitle={this.setTitle} />
      case 'form': return <FormPage navigator={nav} form={route.form} survey={route.survey} />
      default: return <SurveyListPage navigator={nav} setTitle={this.setTitle} />
    }
  },
  render() {
    const initialRoute = {name: 'surveylist'}
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
    )
  }
})

module.exports = SharedNavigator
