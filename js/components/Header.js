import React, {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import Styles from '../styles/Styles'
import Icon from 'react-native-vector-icons/FontAwesome'

const Header = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object,
  },

  getInitialState() {
    return {
      index: 0,
      name: '',
      prettyName: '',
    }
  },

  componentWillReceiveProps(next_props) {
    // TODO Add prety names to routes
    console.log(next_props)

    // Measuring position with routeStack as presentedIndex seems to take a short while to update in this object
    const position = next_props.navState.routeStack.length - 1
    console.log(position)
    this.setState({
      index: position,
      name: next_props.navState.routeStack[position].name,
      prettyName: next_props.navState.routeStack[position].name,
    })
  },

  /* Methods */
  navigateBack() {
    this.props.navigator.pop()
  },

  /* Render */
  render() {
    // console.log(this.state.index)
    return (
      <View style={Styles.header.navBar}>
        {
          this.state.index > 0 ?
          <View style={Styles.header.navBarLeftButton}>
            <TouchableWithoutFeedback onPress={this.navigateBack}>
              <Icon name="chevron-left" size={30} color="#FFFFFF" />
            </TouchableWithoutFeedback>
          </View>
          : null
        }
        <View>
          <Text>
            {this.state.prettyName}
          </Text>
        </View>
      </View>
    )
  }
})

module.exports = Header
