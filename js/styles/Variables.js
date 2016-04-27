import { Platform } from 'react-native'

const Variables = {
  HEADER_SIZE: 60,
  HEADER_PADDING: 20,
}

if ( Platform.OS === 'android' ) {
  Variables.HEADER_PADDING = 10
}

module.exports = Variables