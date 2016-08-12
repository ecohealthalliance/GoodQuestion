import { Platform } from 'react-native';

const Variables = {
  HEADER_SIZE: 70,
  HEADER_SIZE_SMALL: 20,
  HEADER_PADDING: 20,
  REGISTRATION_HEIGHT: 125,
  PROFILE_HEIGHT: 260,
  LOGIN_HEIGHT: 125,
  FOOTER_HEIGHT: 80,
};

if (Platform.OS === 'android') {
  Variables.HEADER_SIZE = 60;
  Variables.HEADER_SIZE_SMALL = 0;
  Variables.HEADER_PADDING = 0;
}

module.exports = Variables;
