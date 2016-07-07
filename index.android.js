import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'

console.disableYellowBox = true;

/* Android App */
const GoodQuestion = React.createClass ({
  /* Render */
  render() {
    return ( <App /> )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
