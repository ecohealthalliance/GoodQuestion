import Parse from 'parse/react-native'

const server = 'test'


export function connectToParseServer() {
  switch (server) {
    case 'local':
      Parse.serverURL = 'http://localhost:1337/parse'
      Parse.initialize('testapp')
      break
    case 'test':
      Parse.serverURL = 'http://survey.eha.io:1337/parse'
      Parse.initialize('testapp')
      break
  }
}