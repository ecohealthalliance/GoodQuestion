import { StyleSheet } from 'react-native';
import Color from './Color';

const FormStyles = StyleSheet.create({
  titleHeading: {
    textAlign: 'center',
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Color.background1,
  },
  titleText: {
    flex: 1,
    color: Color.primary,
    fontSize: 18,
  },
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
  inlineForm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
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
    backgroundColor: Color.primary,
    padding: 12,
    margin: 10,
    borderRadius: 5,
    borderWidth: 0,
  },
  roundButton: {
    backgroundColor: Color.secondary,
    alignSelf: 'auto',
    borderRadius: 100,
    borderWidth: 0,
    width: 36,
    height: 36,
    padding: 8,
    marginVertical: 2,
    marginHorizontal: 10,
  },

  primaryButton: {
    backgroundColor: Color.primary,
  },
  successButton: {
    backgroundColor: Color.success,
  },
  primaryButtonText: {
    color: Color.background2,
  },
  successButtonText: {
    color: Color.background3,
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
  errorText: {
    paddingLeft: 5,
    color: 'red',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inputGroup: {
    padding: 5,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 2,
    borderRadius: 3,
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
    margin: 5,
  },
  questionBtn: {
    borderColor: Color.secondary,
    borderWidth: 2,
    margin: 5,
  },
  doubleButtonLeft: {
    flex: 1,
    alignSelf: 'auto',
    borderColor: Color.secondary,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderLeftWidth: 2,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  doubleButtonRight: {
    flex: 1,
    alignSelf: 'auto',
    borderColor: Color.secondary,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,

  },
  questionLabel: {
    color: Color.primary,
    fontSize: 20,
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    borderRadius: 0,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonActive: {
    backgroundColor: Color.success,
  },
  registrationView: {
    paddingTop: 25,
    paddingBottom: 35,
    marginBottom: 0,
  },
  registerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerTextActive: {
    color: Color.primary,
  },
  registerTextInactive: {
    color: Color.secondary,
  },
});

module.exports = FormStyles;
