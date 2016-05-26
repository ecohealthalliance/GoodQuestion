import { Platform } from 'react-native'
import Parse from 'parse/react-native'
import Store from '../data/Store'

export function connectToParseServer(server, appId) {
  // Sync the Store variable and the new passed value, if any
  if (!server) {
    server = Store.server
  } else {
    Store.server = server
  }

  console.log('CONNECTING')

  // Connect to the specified Parse server
  switch (server) {
    case 'local': connectToLocalServer(); break;
    case 'remote-test': connectToRemoteTestServer(); break;
    default:
      if (server && appId) {
        connectToCustomServer(server, appId);
      } else {
        console.warn('Error: Invalid connection credentials.')
      }
      break;
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

function connectToCustomServer(server, appId) {
  Parse.initialize(appId)
  Parse.serverURL = server
  // testConnection(5000, () => {})
}

function testConnection(delay, callback) {
  setTimeout(() => {
    console.log(Parse.Session.current())
    console.log(Parse.Session.current()._rejected)
    callback(Parse.Session.current()._rejected)
  }, delay)
}