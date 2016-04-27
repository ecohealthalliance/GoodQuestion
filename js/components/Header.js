import React, {
  Navigator,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
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
            Title
          </Text>
        </View>
      </View>
    )
  }
})

module.exports = Header