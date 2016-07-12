import { StyleSheet } from 'react-native';

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
    flex: 0.75,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'stretch',
    // position: 'absolute',
    // height: 60
  },
  icon: {
    flex: 0.25,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    color: 'dimgray',
  },
});

module.exports = ToastStyles;
