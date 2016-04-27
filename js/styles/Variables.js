import { Platform } from 'react-native'

const Variables = {
  HEADER_SIZE: 80,
  HEADER_PADDING: 20,
}

if ( Platform.OS === 'android' ) {
  Variables.HEADER_SIZE = 60
  Variables.HEADER_PADDING = 0
}

module.exports = Variables