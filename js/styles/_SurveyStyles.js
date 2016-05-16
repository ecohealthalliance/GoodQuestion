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
    backgroundColor: 'transparent',
    borderRadius: 25,
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

  // Survey Details
  surveyDescription: {
    padding: 15,
    backgroundColor: Color.background1,
    borderTopWidth: 2,
    borderColor: Color.background1Edge,
  },
  surveyStats: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  surveyStatsBlock: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 2,
    borderColor: Color.background1,
    padding: 15,
  },
  surveyStatsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: Color.background1,
  },
  surveyNotes: {
    padding: 30,
  },
  acceptButton: {
    // flex: 1,
    borderRadius: 0,
    backgroundColor: Color.background,
    color: Color.positive,
  },
  declineButton: {
    // flex: 1,
    borderRadius: 0,
    backgroundColor: Color.background,
    color: Color.warning,
  },
})

module.exports = SurveyStyles
