import { Platform } from 'react-native'
import Parse from 'parse/react-native'
import Store from '../data/Store'

export function connectToParseServer(server, appId) {
  console.log('CONNECTING')
  // Connect to the specified Parse server
  if (server && appId) {
    Parse.initialize(appId)
    Parse.serverURL = server
    // testConnection(5000, () => {})
  } else {
    console.warn('Error: Invalid connection credentials.')
  }
}

function testConnection(delay, callback) {
  setTimeout(() => {
    console.log(Parse.Session.current())
    console.log(Parse.Session.current()._rejected)
    callback(Parse.Session.current()._rejected)
  }, delay)
}