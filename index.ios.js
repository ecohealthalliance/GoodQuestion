/**
 * Good Question
 * @flow
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/data/ParseServer'
import createParseData from './js/data/PopulateParseServer'

// Router
import SharedNavigator from './js/router/SharedNavigator'


/* Initialize Parse Server */
connectToParseServer()

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

createParseData()

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
