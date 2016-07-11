import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
} from 'react-native'

import Styles from '../styles/Styles'

const CalendarPage = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {}
  },

  componentDidMount() {
  },

  componentWillUnmount() {
  },

  /* Methods */
  

  /* Render */
  render() {
    return (
      <View style={[Styles.container.default, { flex: 1, overflow: 'hidden' }]}>
        
      </View>
    )
  }
})

module.exports = CalendarPage
