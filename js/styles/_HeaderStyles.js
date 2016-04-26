import { StyleSheet } from 'react-native'
import Color from './Color'


const HeaderStyles = StyleSheet.create({
  navBar: {
    backgroundColor: Color.background1,
  },
  navBarText: {
    color: Color.background2,
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: Color.background2,
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
})

module.exports = HeaderStyles