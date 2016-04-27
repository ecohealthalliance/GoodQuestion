import React, { 
  Platform,
  Navigator,
  TouchableOpacity,
  Text,
} from 'react-native'

// Components
import Header from '../components/Header'

// Styles
import Styles from '../styles/Styles'

// Views
import App from '../App'
import WelcomePage from '../views/WelcomePage'
import LoginPage from '../views/LoginPage'
import SurveyListPage from '../views/SurveyListPage'
import TermsOfServicePage from '../views/TermsOfServicePage'
import RegistrationPagePart1 from '../views/RegistrationPagePart1'
import RegistrationPagePart2 from '../views/RegistrationPagePart2'
import RegistrationPagePart3 from '../views/RegistrationPagePart3'
import RegistrationPagePart4 from '../views/RegistrationPagePart4'

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
    case 'welcome': return <WelcomePage />
    case 'login': return <LoginPage />
    case 'surveylist': return <SurveyListPage />
    case 'terms': return <TermsOfServicePage />

    case 'registration1': return <RegistrationPagePart1 />
    case 'registration2': return <RegistrationPagePart2 />
    case 'registration3': return <RegistrationPagePart3 />
    case 'registration4': return <RegistrationPagePart4 />

    default: return <WelcomePage />
  }

  return (
    <App platform="android" style={Styles.container.wrapper}>
      {view}
    </App>
  )
}

const Router = React.createClass ({
  render() {
    const initialRoute = {name: 'surveylist'}
    return (
      <Navigator
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
        navigationBar={
          <Header />
        }
      />
    )
  }
})

module.exports = Router