/**
 * Good Question
 */

import React, {
  AppRegistry,
  BackAndroid,
  Navigator,
  Component,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text
} from 'react-native'

// Model
import Store from './js/data/Store'

// Router
import Router from './js/router/Router'

/* Configuration */
Store.platform = 'android'


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
    const initialRoute = {name: 'welcome'}
    return ( <Router /> )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
