import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const SurveyStyles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
    backgroundColor: Color.background2,
  },
  listitem: {
    flex: 1,
    flexDirection: 'row',
  	padding: 20,
    borderBottomWidth: 1,
    borderColor: Color.background1,
  },
  checkbox: {
   backgroundColor: '#eee',
   borderRadius: 5,
   height: 25,
   width: 25,
   borderWidth: 2,
 },
 title: {
   fontSize: 18,
   color: 'dimgray',
 },
 subtitle: {
   fontSize: 12,
   color: 'dimgray',
 },
})

module.exports = SurveyStyles
