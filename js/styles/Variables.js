import { Platform } from 'react-native'

const Variables = {
  HEADER_SIZE: 70,
  HEADER_PADDING: 20,
  REGISTRATION_HEIGHT: 125,
  PROFILE_HEIGHT: 250,
}

if ( Platform.OS === 'android' ) {
  Variables.HEADER_SIZE = 60
  Variables.HEADER_PADDING = 0
}

module.exports = Variables
