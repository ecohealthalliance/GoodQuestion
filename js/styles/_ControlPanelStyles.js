import { StyleSheet } from 'react-native';
import Color from './Color';

export default StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Color.background1Edge,
  },
  item: {
    flex: 0.75,
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  itemText: {
    color: Color.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  iconView: {
    flex: 0.25,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'cover',
  },
});
