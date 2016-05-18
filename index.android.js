/**
 * Good Question
 */

const BackgroundGeolocation = require('react-native-background-geolocation')

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'

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
    console.log(BackgroundGeolocation)
    return ( <SharedNavigator /> )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
