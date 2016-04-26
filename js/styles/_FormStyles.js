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
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  button: {
    alignSelf: 'stretch',
    textAlign: 'center',
    backgroundColor: Color.positive,
    padding: 20,
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