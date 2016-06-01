import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const ContainerStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Variables.HEADER_SIZE,
    backgroundColor: Color.background3,
  },

  wrapperClearHeader: {
    flex: 1,
    paddingTop: Variables.HEADER_SIZE_SMALL,
    backgroundColor: Color.background3,
  },

  default: {
    flex: 1,
    backgroundColor: Color.background3,
  },

  defaultWhite: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Color.background2,
  },

  compact: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Color.background3,
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
    paddingVertical: 10,
  },

  attentionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  attentionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.background1
  },

  fullView: {
    flex: 1,
    backgroundColor: Color.background2,
  },

  col75: {
    flex: .75,
    flexDirection: 'column',
  },

  col25: {
    flex: .25,
    flexDirection: 'column',
  },

  form: {
    margin: 5,
  },

})

module.exports = ContainerStyles
