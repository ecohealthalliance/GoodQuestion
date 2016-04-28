import React, {
  View,
  Text,
} from 'react-native'

import Styles from '../styles/Styles'

const Header = React.createClass ({
  /* Render */
  render() {
    return (
      <View style={Styles.header.navBar}>
        <View>
          <Text>
            {this.props.title}
          </Text>
        </View>
      </View>
    )
  }
})

module.exports = Header
