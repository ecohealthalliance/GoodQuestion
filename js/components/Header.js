import React, {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert
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
      let routeStack = nextProps.navState.routeStack
      let position = routeStack.length - 1
      let nextTitle = routeStack[routeStack.length-1].title
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
          <Icon name="bars" size={25} color="#FFFFFF" />
        </TouchableWithoutFeedback>
      </View>
    );
  },

  /* Methods */
  backToLogin() {
    this.props.navigator.resetTo({path:'login', title: ''})
    this.setState({title: ''})
  },

  navigateBack() {
    if (this.state.title == "Registration") {
      Alert.alert(
        'Exit registration?',
        '',
        [
          {text: 'OK', onPress: ()=> this.backToLogin()},
          {text: 'Cancel', style: 'cancel'}
        ]
      )
    } else {
      this.props.navigator.pop()
    }
  },

  /* Render */
  render() {
    return (
      <View style={Styles.header.navBar}>
        <View style={Styles.header.navBarLeftButton}>
          {
          this.state.index > 0 ?
          <TouchableWithoutFeedback onPress={this.navigateBack}>
            <Icon name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableWithoutFeedback>
          : null
          }
        </View>
        <View style={Styles.header.navBarTitle}>
          <Text numberOfLines={1} style={Styles.header.navBarTitleText}>
            {this.state.title}
          </Text>
        </View>
        {this.renderDrawer()}
      </View>
    )
  }
})

module.exports = Header
