import { StyleSheet, Platform } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const HeaderStyles = StyleSheet.create({
  navBar: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Variables.HEADER_SIZE,
    paddingTop: Variables.HEADER_PADDING,
    paddingHorizontal: 0,
    backgroundColor: Color.background1,
  },
  navBarClear: {
    backgroundColor: 'transparent'
  },
  iOSPadding: {
    flex: 1,
    height: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Color.background1,
  },

  navBarTitle: {
    flex: .8,
    marginRight: 10,
  },
  navBarTitleText: {
    paddingRight: 10,
    textAlign: 'center',
  },

  banner: {
    // flex: 1,
    height: 160,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: Color.background1,
    paddingTop: 25,
    paddingBottom: 25,
  },
  logo: {
    width: 240,
    resizeMode: 'contain',
  },

  navBarLeftButton: {
    flex: .1,
    padding: 20,
    paddingRight: 16,
    marginRight: 2,
  },
  navBarRightButton: {
    flex: .1,
    padding: 20,
    paddingRight: 14,
  },
})

module.exports = HeaderStyles
