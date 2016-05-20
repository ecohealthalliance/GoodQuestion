import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const ProfileStyles = StyleSheet.create({
  header: {
    height: Variables.PROFILE_HEIGHT,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: Color.background1,
    marginBottom: 10,
  },
  picture: {
    width: 175,
    height: 175,
    borderRadius: 175/2,
    resizeMode: 'contain',
    marginBottom: 10,
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
  }
});

module.exports = ProfileStyles;