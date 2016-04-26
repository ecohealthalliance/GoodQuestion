import Color from './Color'

const HEADER_SIZE = 64

const ContainerStyles = {
  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: HEADER_SIZE,
    backgroundColor: Color.background2,
    borderWidth: 1,
    borderColor: Color.background1,
  },

  welcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: HEADER_SIZE,
    backgroundColor: Color.background1,
  },
}

module.exports = ContainerStyles