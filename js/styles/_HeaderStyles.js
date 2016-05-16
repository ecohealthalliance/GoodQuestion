import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const HeaderStyles = StyleSheet.create({
  navBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Variables.HEADER_SIZE,
    paddingTop: Variables.HEADER_PADDING,
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
    flex: 1,
    position: 'absolute',
    left: 10,
    top: 16 + Variables.HEADER_PADDING,
    paddingLeft: 10,
  },
  navBarRightButton: {
    flex: 1,
    position: 'absolute',
    paddingRight: 10,
    right: 10,
    top: 16 + Variables.HEADER_PADDING,
  },
})

module.exports = HeaderStyles
