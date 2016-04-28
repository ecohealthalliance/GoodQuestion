/**
 * Good Question
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'

// Router
import SharedNavigator from './js/router/SharedNavigator'


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
