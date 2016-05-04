import { StyleSheet, Platform } from 'react-native'
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
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: Color.background2,
  },

  button: {
    backgroundColor: Color.positive,
    padding: 12,
    margin: 10,
    borderRadius: 5,
  },
  primaryButton: {
    backgroundColor: Color.primary,
  },
  wideButton: {
    marginHorizontal: 0,
    alignSelf: 'stretch',
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: Color.primary,
  },
  primaryButtonText: {
    color: Color.background2,
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
  submitBtn: {
    margin: 5
  },
  questionLabel: {
    color: Color.primary,
    fontSize: 20,
  }
})

module.exports = FormStyles
