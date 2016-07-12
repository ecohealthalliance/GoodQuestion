import Parse from 'parse/react-native';

export function connectToParseServer(server, appId) {
  if (server && appId) {
    Parse.initialize(appId);
    Parse.serverURL = server;
  } else {
    console.warn('Error: Invalid connection credentials.');
  }
}
