import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'


const SurveyStyles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
    backgroundColor: Color.background2,
    borderTopWidth: 1,
    borderColor: Color.background1,
  },
  listitem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Color.background1,
  },
  listfilter: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.background1,
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
  itemDescription: {
    paddingTop: 6,
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

  acceptanceButtons: {
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 60,
    left: 0,
    right: 0,
    bottom: 0,
  },
  acceptButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderColor: Color.background1,
    borderRadius: 0,
    backgroundColor: Color.background2,
    margin: 0,
    paddingTop: 15,
  },
  declineButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderTopWidth: 2,
    borderColor: Color.background1,
    borderRadius: 0,
    backgroundColor: Color.background2,
    margin: 0,
    paddingTop: 15,
  },

  // Survey Form components
  formButtons: {
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 50,
    left: 0,
    right: 0,
    bottom: 0,
  },
  formButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 2,
    borderColor: Color.faded,
    borderRadius: 0,
    backgroundColor: Color.background2,
    margin: 0,
    paddingTop: 10,
  },
  navMenu: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    backgroundColor: Color.background1,
  },
})

module.exports = SurveyStyles
