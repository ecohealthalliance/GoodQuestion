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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    flex: 0.8,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingRight: 20,
  },
  icon: {
    flex: 0.20,
    flexDirection: 'column',
    paddingTop: 23,
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    color: 'dimgray',
  },
});

module.exports = ToastStyles;
