import React, {
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native'

import Styles from '../styles/Styles'
import Color from '../styles/Color'

const SurveyFormNavigator = React.createClass ({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    total: React.PropTypes.number.isRequired,
    onPressed: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      index: this.props.index,
      total: this.props.total,
    }
  },

  /* Methods */
  handlePress(direction) {
    if (direction === 'prev' && this.state.index > 0) {
      this.props.onPressed(this.state.index-1)      
    } else if (direction === 'next' && this.state.index < this.state.total) {
      this.props.onPressed(this.state.index+1) 
    }
  },

  update(newIndex, newTotal) {
    this.setState({index: newIndex, total: newTotal})
  },

  /* Render */
  renderText() {
    if (this.state.index < this.state.total) {
      return (this.state.index+1) + '/' + this.state.total
    } else {
      return this.state.total + '/' + this.state.total
    }
  },

  render() {
    return (
      <View style={Styles.survey.navMenu}>
        <TouchableWithoutFeedback
          onPress={() => this.handlePress('prev')}>
          <View style={{opacity: this.state.index > 0 ? 1 : 0.5}}>
            <Text style={{color: Color.primary}}>Prev</Text>
          </View>
        </TouchableWithoutFeedback>

        <View>
          <Text style={{color: Color.primary}}>
          {this.renderText()}
          </Text>
        </View>

        <TouchableWithoutFeedback
          onPress={() => {this.handlePress('next')}}>
          <View style={{opacity: this.state.index < this.state.total ? 1 : 0.5}}>
            <Text style={{color: Color.primary}}>Next</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
})

module.exports = SurveyFormNavigator
