import { StyleSheet, Platform } from 'react-native'
import Color from './Color'


const QuestionStyles = StyleSheet.create({
  block: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 20,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: Color.background2,
    borderColor: Color.background1,
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginHorizontal: -10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Color.primary,
    fontSize: 24,
    backgroundColor: Color.background1,
  },

  text: {
    marginTop: 5,
    marginBottom: 15,
  }
})

module.exports = QuestionStyles
