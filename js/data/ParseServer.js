import Parse from 'parse/react-native'

export function connectToParseServer() {
  Parse.initialize('goodquestion1');
  Parse.serverURL = 'http://localhost:1337/parse'
}