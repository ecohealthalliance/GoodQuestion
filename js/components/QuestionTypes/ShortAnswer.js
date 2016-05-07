
import React, {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import Styles from '../../styles/Styles'

const ShortAnswer = React.createClass ({
  componentWillMount() {
    console.log('ShortAnswer.props: ', this.props);
  },
  render() {
    return (
      <View>
        <Text style={Styles.type.h1}>{this.props.question.get('text')}</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={this.props.onChange}
          value={this.props.value}
        />
      </View>
    )
  }
})

module.exports = ShortAnswer
