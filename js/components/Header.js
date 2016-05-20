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
      title: '',
      path: 'none'
    }
  },

  immediatelyRefresh() {
    // NoOp https://github.com/facebook/react-native/issues/6205
  },

  componentWillReceiveProps(nextProps) {
    try {
      let title = this.state.title
      let position = nextProps.navState.routeStack.length - 1
      let nextTitle = nextProps.navState.routeStack[nextProps.navState.routeStack.length-1].title
      if (nextTitle && nextTitle !== title) {
        title = nextTitle
      }
      this.setState({
        title: title,
        index: position
      })
    } catch(e) {
      console.warn(e)
    }
  },

  renderDrawer() {
    if (typeof this.props.openDrawer === 'undefined') return;
    return (
      <View style={Styles.header.navBarRightButton}>
        <TouchableWithoutFeedback onPress={this.props.openDrawer}>
          <Icon name="bars" size={30} color="#FFFFFF" />
        </TouchableWithoutFeedback>
      </View>
    );
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
        {this.renderDrawer()}
      </View>
    )
  }
})

module.exports = Header
