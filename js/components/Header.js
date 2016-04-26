import React, {
  Navigator,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'

import Color from '../styles/Color'

const Header = React.createClass ({
  
  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    firstIndex: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      navigator: {},      
    }
  },

  getInitialState() {
    return {
      tabIndex: this.props.firstIndex,
    }
  },

  /* Methods */
  handleTouch(route) {
    // let tabIndex = ROUTE_STACK.indexOf(route)
    let tabIndex = 0
    this.setState({
      tabIndex: tabIndex
    })
  },

  /* Render */
  render() {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Enter your email
          </Text>
        </View>
        
        <View style={styles.navbar}>

          <TouchableOpacity
            onPress={this.handleTouch}
            style={[styles.navBarButton, styles.navBarLeftButton]}>
            <Text style={styles.navBarText}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleTouch}
            style={styles.navBarButton}>
            <Text style={styles.navBarText}>
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleTouch}
            style={[styles.navBarButton, styles.navBarRightButton]}>
            <Text style={styles.navBarText}>
              Pending
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }
})


const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: Color.background2,
    backgroundColor: Color.background1,
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})


module.exports = Header