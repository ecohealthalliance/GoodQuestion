import { StyleSheet } from 'react-native'
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
  navBarLeftButton: {
    flex: .1,
    marginLeft: Variables.HEADER_PADDING,
  },
  navBarRightButton: {
    flex: .1,
    marginRight: Variables.HEADER_PADDING - 10,
  },
})

module.exports = HeaderStyles
