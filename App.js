import React, {
  AppRegistry,
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native'

// Views
import EmailView from './js/views/EmailView'


const App = React.createClass ({
  propTypes: {
    platform: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      view: 'email',
      tab: '',
    }
  },

  /* Methods */
  navigate(view, tab) {
    this.setState({
      view: view,
      tab: tab ? tab : '',
    })
  },

  /* Render */

  renderView() {
    switch (this.state.view) {
      case 'email': return <EmailView />
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Header
        </Text>

        {this.renderView()}
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    textAlign: 'center',
    color: '#3333DD',
    marginBottom: 5,
  },
})

module.exports = App
