import { StyleSheet } from 'react-native';
import Color from './Color';
import Variables from './Variables';


const ProfileStyles = StyleSheet.create({
  header: {
    height: Variables.PROFILE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background1,
  },
  avatarView: {
  },
  avatarTouchable: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    right: 0,
  },
  basicInfoView: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeProfileImageView: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.background1,
  },
  body: {
    flex: 1,
    margin: 15,
  },
  name: {
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

module.exports = ProfileStyles;
