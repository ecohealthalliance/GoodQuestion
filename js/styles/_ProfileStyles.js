import { StyleSheet } from 'react-native';
import Color from './Color';
import Variables from './Variables';


const ProfileStyles = StyleSheet.create({
  header: {
    height: Variables.PROFILE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background1,
    marginBottom: 10,
  },
  body: {
    flex: 1,
    margin: 15,
  },
  username: {
    padding: 2,
    fontSize: 18,
    color: '#fff',
  },
  phone: {
    padding: 2,
    fontSize: 14,
    color: '#fff',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Color.background1Edge,
  },
  caretView: {
    flex: 0.15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 25,
  },
  item: {
    flex: 0.70,
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  itemText: {
    color: Color.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconView: {
    flex: 0.15,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 25,
  },
  picture: {
    width: 175,
    height: 175,
    borderRadius: 175 / 2,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

module.exports = ProfileStyles;
