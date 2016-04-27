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
      navigator.pop()
      return true
    }
    return false
  })
}

const RouteMapper = function(route, navigationOperations, onComponentRef) {
  navigator = navigationOperations
  let view
  switch (route.name) {
    case 'login': return <LoginPage navigator={navigator} />
    case 'surveylist': return <SurveyListPage navigator={navigator} />
    case 'terms': return <TermsOfServicePage navigator={navigator} />

    case 'registration1': return <RegistrationPagePart1 navigator={navigator} />

    default: return <SurveyListPage navigator={navigator} />
  }
}

const SharedNavigator = React.createClass ({
  render() {
    // const initialRoute = {name: 'surveylist', prettyName: 'Survey List'}
    const initialRoute = {name: 'registration1', prettyName: 'Survey List'}
    return (
      <Navigator
        ref={(nav) => { navigator = nav }}
        initialRoute={initialRoute}
        renderScene={RouteMapper}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
        style={Styles.container.wrapper}
        navigationBar={
          <Header />
        }
      />
    )
  }
})

module.exports = SharedNavigator