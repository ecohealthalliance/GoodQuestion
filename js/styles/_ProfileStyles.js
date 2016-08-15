import { StyleSheet } from 'react-native';
import Color from './Color';
import Variables from './Variables';


const ProfileStyles = StyleSheet.create({
  header: {
    height: Variables.PROFILE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background1,
  },
  avatarView: {
  },
  avatarTouchable: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    right: 0,
  },
  basicInfoView: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeProfileImageView: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background1,
  },
  picture: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    resizeMode: 'cover',
  },
  name: {
    padding: 2,
    fontSize: 18,
    color: '#fff',
  },
  phone: {
    padding: 2,
    fontSize: 14,
    color: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

module.exports = ProfileStyles;
