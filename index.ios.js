/**
 * Good Question
 * @flow
 */

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'

// Router
import Router from './js/router/Router'

/* Configuration */
Store.platform = 'ios'


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
    return ( <Router /> )
  }
})



AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
