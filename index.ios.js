AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)

import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'

/* Android App */
const GoodQuestion = React.createClass ({
  /* Render */
  render() {
    return ( <App /> )
  }
})

AppRegistry.registerComponent('GoodQuestion', () => GoodQuestion)
