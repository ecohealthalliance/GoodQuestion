import { StyleSheet } from 'react-native'
import Color from './Color'
// Making this into a stylesheet causes an error.
// The drawer library expects a plain object.
export default {
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    backgroundColor: Color.background1,
  },
  main: {
    paddingLeft: 3,
  },
}
