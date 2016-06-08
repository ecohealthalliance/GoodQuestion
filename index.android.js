/**
 * Good Question
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'

// Router
import SharedNavigator from './js/router/SharedNavigator'

console.disableYellowBox = true;


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
