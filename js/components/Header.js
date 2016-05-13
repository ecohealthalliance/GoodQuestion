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
      title: 'Good Question',
      path: 'none'
    }
  },

  componentWillReceiveProps(nextProps) {
    try {
      let position = nextProps.navState.routeStack.length - 1
      let nextTitle = nextProps.navState.routeStack[nextProps.navState.routeStack.length-1].title
      if (nextTitle && nextTitle !== this.state.title) {
        this.setState({
          title: nextTitle,
          index: position,
        })
      }
    } catch(e) {
      console.warn(e)
    }
  },

  /* Methods */
  navigateBack() {
    this.props.navigator.pop()
  },

  /* Render */
  render() {
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
            {this.state.title}
          </Text>
        </View>
      </View>
    )
  }
})

module.exports = Header
