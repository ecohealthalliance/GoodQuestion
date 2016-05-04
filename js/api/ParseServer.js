import { Platform } from 'react-native'
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
    default: connectToCustomServer(server); break;
  }
}

function connectToLocalServer() {
  Parse.initialize('testapp')
  if (Platform.OS === 'android') {
    Parse.serverURL = 'http://10.0.2.2:1337/parse'
  } else {
    Parse.serverURL = 'http://localhost:1337/parse'
  }
}

function connectToRemoteTestServer() {
  Parse.initialize('testapp')
  Parse.serverURL = 'http://survey.eha.io:1337/parse'
}

function connectToCustomServer(server) {
  Parse.initialize('testapp')
  Parse.serverURL = server
}