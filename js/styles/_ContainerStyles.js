import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const ContainerStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Color.background2,
  },

  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: Variables.HEADER_SIZE,
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
    marginTop: Variables.HEADER_SIZE,
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
    marginTop: Variables.HEADER_SIZE,
    backgroundColor: Color.background1,
  },

  informational: {
    marginTop: Variables.HEADER_SIZE,
    backgroundColor: Color.background2,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 110,
  },
})

module.exports = ContainerStyles