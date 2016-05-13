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
    title: React.PropTypes.string,
  },

  getInitialState() {
    return {
      index: 0,
      title: this.props.title,
    }
  },

  componentWillReceiveProps(nextProps) {
    let state = Object.assign({}, this.state);
    if (nextProps.navState) {
      const position = nextProps.navState.routeStack.length - 1
      state.index = position;
    }
    if (typeof nextProps.title !== 'undefined') {
      state.title = nextProps.title;
    }
    this.setState(state);
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
