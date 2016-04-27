/**
 * Good Question
 * @flow
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'

// Router
import SharedNavigator from './js/router/SharedNavigator'


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
    const initialRoute = {name: 'registration1'}
    return ( <SharedNavigator /> )
  }
})



AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
