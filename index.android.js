/**
 * Good Question
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'
import { initializeLocalParseData, resetLocalServer } from './js/api/PopulateLocalParseServer'
import { loadSurveyList } from './js/api/Surveys'

// Router
import SharedNavigator from './js/router/SharedNavigator'

/* Initialize Parse Server */
// Create initial connection to a Parse server. Valid options are:
//  local
//  remote-test
//  CUSTOM IP: Your own parse server IP
connectToParseServer('local')

// Uncomment this following function to empty your local server when the App launches.
// resetLocalServer()

// For now, resetting and first-time initializing may require an App refresh to come into effect.
// Be wary of running multiple emulators while resetting/initializing your data.
initializeLocalParseData()


/* Android App */
const GoodQuestion = React.createClass ({
  /* Life Cycle */
  getInitialState() {
    return {
      store: Store
    }
  },

  /* Render */
  render() {
    return ( <SharedNavigator /> )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
