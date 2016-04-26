import { StyleSheet } from 'react-native'
import Color from './Color'


const SurveyStyles = {
  list: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: Color.background2,
  },
  listitem: {
  	padding: 20,
  	alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderColor: Color.background1,
  },
}

module.exports = SurveyStyles