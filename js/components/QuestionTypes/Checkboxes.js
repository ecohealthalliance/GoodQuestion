import React, {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import Checkbox from 'react-native-checkbox'
import Styles from '../../styles/Styles'
import Color from '../../styles/Color'
import ViewText from '../ViewText'
import Icon from 'react-native-vector-icons/FontAwesome'

let uncheckedComponent = <Icon name='circle-o' size={30} color={Color.primary} />
let checkedComponent = <Icon name='check-circle' size={30} color={Color.primary} />

const Checkboxes = React.createClass ({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array,
    ]),
  },

  getDefaultProps: function () {
    return {
      value: '',
      properties: [],
    }
  },

  getInitialState: function() {
    return {
      selectedChoices: this.props.value || []
    }
  },

  /* Methods */
  handleChange(value) {
    this.setState({
      selectedChoices: value
    })
    this.props.onChange(Array.from(value))
  },

  /* Render */
  render() {
    let selectedChoices = new Set(this.state.selectedChoices)
    return (
      <View style={Styles.question.block}>
        <ViewText 
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        {this.props.properties.choices.map((choice, idx)=>{
          return (
            <View style={{marginHorizontal: 15, marginVertical:5}} key={idx}>
              <Checkbox
                label={choice}
                labelStyle={{height:34, paddingTop: 9, textAlignVertical: "center", color: Color.primary}}
                checked={selectedChoices.has(choice)}
                uncheckedComponent={uncheckedComponent}
                checkedComponent={checkedComponent}
                onChange={(checked)=>{
                  if (checked) {
                    selectedChoices.add(choice)
                  } else {
                    selectedChoices.delete(choice)
                  }
                  this.handleChange(selectedChoices)
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }
})

module.exports = Checkboxes
