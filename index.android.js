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

// Uncomment this next line to empty your local server. Removes all Survey, Form, Question, and Trigger objects.
// resetLocalServer()

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
