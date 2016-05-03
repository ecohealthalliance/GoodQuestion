import Parse from 'parse/react-native'
import Store from '../data/Store'

export function connectToParseServer(server) {
  // Sync the Store variable and the new passed value, if any
  if (!server) {
    server = Store.server
  } else {
    Store.server = server
  }

  // Connect to the specified Parse server
  switch (Store.server) {
    case 'local': connectToLocalServer(); break;
    case 'remote-test': connectToRemoteTestServer(); break;
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