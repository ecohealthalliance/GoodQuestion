import { StyleSheet } from 'react-native';
import Color from './Color';

const TypeStyles = StyleSheet.create({

  // Headings & Sub-headings
  h1: {
    color: Color.primary,
    fontSize: 24,
    margin: 10,
  },
  h2: {
    color: Color.faded,
    fontSize: 20,
    margin: 10,
  },
  h3: {
    fontSize: 16,
    margin: 10,
  },

  // Text
  p: {
    color: '#333333',
    marginBottom: 5,
  },
  statusMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  statusMessage: {
    textAlign: 'center',
    fontSize: 26,
    color: Color.primary,
  },
  statusMessageSecondary: {
    color: Color.secondary,
    fontSize: 14,
  },
  // Interactive
  link: {
    color: Color.primary,
    fontWeight: 'bold',
  },
});

module.exports = TypeStyles;
