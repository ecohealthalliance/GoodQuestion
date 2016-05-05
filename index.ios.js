/**
 * Good Question
 * @flow
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


/* iOS App */
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
