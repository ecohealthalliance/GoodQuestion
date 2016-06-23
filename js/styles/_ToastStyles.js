import { StyleSheet, Platform } from 'react-native'
import Color from './Color'


const ToastStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: 60,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    flex: .75,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'stretch',
    // position: 'absolute',
    // height: 60
  },
  icon: {
    flex: .25,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    color: 'dimgray',
  },
})

module.exports = ToastStyles
