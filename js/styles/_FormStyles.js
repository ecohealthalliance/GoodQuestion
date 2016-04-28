import { StyleSheet } from 'react-native'
import Color from './Color'


const FormStyles = StyleSheet.create({
  fixedForm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bottomForm: {
    justifyContent: 'center',
    alignItems: 'stretch',
    height: 100,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: Color.background2,
  },

  button: {
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: Color.positive,
    padding: 20,
    margin: 10,
  },
  primaryButton: {
    backgroundColor: Color.primary,
    color: Color.background2,
  },
  wideButton: {
    marginHorizontal: 0,
    alignSelf: 'stretch',
  },

  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 2,
    borderRadius: 5,
  },
  inputWide: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 2,
    borderRadius: 5,
  },
})

module.exports = FormStyles