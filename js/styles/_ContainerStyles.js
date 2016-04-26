import { Platform } from 'react-native'
import Color from './Color'


// Variables
let HEADER_SIZE = 0

if ( Platform.OS === 'android' ) {
  HEADER_SIZE = 56
}

const ContainerStyles = {
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
    marginTop: HEADER_SIZE,
    backgroundColor: Color.background2,
    borderWidth: 1,
    borderColor: Color.background1,
  },

  welcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: HEADER_SIZE,
    backgroundColor: Color.background1,
  },
}

module.exports = ContainerStyles