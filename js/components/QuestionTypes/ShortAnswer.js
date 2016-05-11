
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
      <View style={Styles.question.block}>
        <Text style={Styles.question.header}>Question #1</Text>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.question.get('text')}</Text>
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
