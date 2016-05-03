import Parse from 'parse/react-native'

const server = 'test'


export function connectToParseServer() {
  switch (server) {
    case 'local': connectToLocalServer(); break;
    case 'test': connectToRemoteTestServer(); break;
  }
}

function connectToLocalServer() {
  Parse.serverURL = 'http://localhost:1337/parse'
  Parse.initialize('testapp')
}

function connectToRemoteTestServer() {
  Parse.serverURL = 'http://survey.eha.io:1337/parse'
  Parse.initialize('testapp')
}