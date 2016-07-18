import { StyleSheet } from 'react-native';
import Color from './Color';

const QuestionStyles = StyleSheet.create({
  block: {
    marginVertical: 20,
    marginHorizontal: Platform.OS === 'ios' ? 8 : 20,
    marginBottom: 45,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: Color.background2,
    borderColor: Color.background1,
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginHorizontal: -10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Color.background1,
  },
  headerComplete: {
    alignItems: 'center',
    backgroundColor: Color.success,
  },
  headerText: {
    color: Color.primary,
    fontSize: 24,
  },
  headerCompleteIcon: {
    flex: 0.3,
    marginRight: 5,
  },
  headerCompleteView: {
    flex: 0.7,
  },
  headerCompleteViewText: {
    fontWeight: 'bold',
    color: Color.primary,
    fontSize: 25,
  },
  text: {
    marginTop: 5,
    marginBottom: 15,
  },
  smallInput: {
    marginVertical: 30,
    marginHorizontal: 5,
  },
  notes: {
    marginVertical: 15,
  },
});

module.exports = QuestionStyles;
