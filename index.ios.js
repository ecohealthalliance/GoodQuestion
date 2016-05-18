/**
 * Good Question
 * @flow
 */

const backgroundGeolocation = require('react-native-background-geolocation')

import React, { AppRegistry } from 'react-native'

// Model
import Store from './js/data/Store'
import { connectToParseServer } from './js/api/ParseServer'

// Router
import SharedNavigator from './js/router/SharedNavigator'

// Due to a bug in React Native, we must temporarily ignore propType warnings for some iOS components to work.
// Affected component: DatePickerIOS
console.ignoredYellowBox = [
  'Warning: Failed propType',
]


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
    console.log(backgroundGeolocation)
    return ( <SharedNavigator /> )
  }
})


AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
