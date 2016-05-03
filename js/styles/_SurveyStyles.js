import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const SurveyStyles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
    backgroundColor: Color.background2,
  },
  listitem: {
  	padding: 20,
  	alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderColor: Color.background1,
  }
})

module.exports = SurveyStyles
