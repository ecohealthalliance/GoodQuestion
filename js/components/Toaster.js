import React, {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connectToaster } from '../api/Notifications'

const Toaster = React.createClass ({
  propTypes: {
    navigator: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      icon: 'circle-o',
    }
  },

  getInitialState() {
    return {
      title: 'Title',
      text: 'Yea toast!',
      duration: 10,
      action: () => {},
    }
  },

  componentDidMount() {
    connectToaster(this)
  },

  /* Methods */
  handlePress() {
    this.state.action()
  },
  
  /* Render */

  render() {
    return (
      <View style={Styles.toast.wrapper}>
        <TouchableOpacity onPress={this.handlePress}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={Styles.toast.icon}>
              <Icon name='circle-o' size={38} color={Color.faded} />
            </View>
            <View style={Styles.toast.container}>
              <Text style={Styles.toast.title}>{this.state.title}</Text>
              <Text style={Styles.toast.text}>{this.state.text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
})

module.exports = Toaster
