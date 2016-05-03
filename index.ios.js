/**
 * Good Question
 * @flow
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'
import { initializeParseData, resetLocalServer } from './js/api/PopulateLocalParseServer'
import { loadSurveyList } from './js/api/Surveys'

// Router
import SharedNavigator from './js/router/SharedNavigator'


/* Initialize Parse Server */
connectToParseServer('local')
// resetLocalServer()
initializeParseData()


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
