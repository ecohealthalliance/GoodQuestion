/**
 * Good Question
 * @flow
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/data/ParseServer'
import { initializeParseData } from './js/data/PopulateParseServer'
import { loadSurveyList } from './js/api/Surveys'

// Router
import SharedNavigator from './js/router/SharedNavigator'


/* Initialize Parse Server */
connectToParseServer()
// initializeParseData()
// loadSurveyList()


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
