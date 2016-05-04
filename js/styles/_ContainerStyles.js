import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const ContainerStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Variables.HEADER_SIZE,
    backgroundColor: Color.background2,
  },

  default: {
    backgroundColor: Color.background2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Color.background1,
  },

  compact: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Color.background2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Color.background1,
    padding: 40,
  },

  welcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Color.background1,
  },

  informational: {
    backgroundColor: Color.background2,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 110,
  },

  col75: {
    flex: .75,
    flexDirection: 'column',
  },

  col25: {
    flex: .25,
    flexDirection: 'column',
  },

})

module.exports = ContainerStyles
