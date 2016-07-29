import { StyleSheet } from 'react-native'
import Color from './Color'
import Variables from './Variables'

export default StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
    flex: 1
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    
  },
  item: {
    flex: 1,
  	paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: Color.background1Edge,
  },
  itemText: {
    color: Color.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  }
})
