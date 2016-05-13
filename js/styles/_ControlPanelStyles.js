import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'

export default StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 30,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
  	padding: 20,
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderColor: Color.background1Edge,
  },
  itemText: {
    color: Color.primary,
    fontSize: 18,
    fontWeight: 'bold',
  }
})
