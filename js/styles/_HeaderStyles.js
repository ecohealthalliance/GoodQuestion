import { StyleSheet, Platform } from 'react-native';
import Color from './Color';
import Variables from './Variables';


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
    backgroundColor: 'transparent',
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
    flex: 0.8,
    marginRight: 10,
  },
  navBarTitleText: {
    paddingRight: 10,
    textAlign: 'center',
  },

  banner: {
    // flex: 1,
    height: Variables.REGISTRATION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background1,
    paddingTop: 25,
    paddingBottom: 25,
  },
  logo: {
    width: 240,
    resizeMode: 'contain',
  },

  navBarLeftButton: {
    flex: 0.1,
    padding: Platform.OS === 'ios' ? 14 : 18,
    paddingRight: Platform.OS === 'ios' ? 14 : 16,
    marginRight: 2,
  },
  navBarRightButton: {
    flex: 0.1,
    padding: Platform.OS === 'ios' ? 14 : 18,
    paddingRight: Platform.OS === 'ios' ? 10 : 14,
  },
});

module.exports = HeaderStyles;
