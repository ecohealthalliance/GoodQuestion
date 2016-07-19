import React from 'react';
import {
  Text,
  View,
  Slider,
} from 'react-native';
import Styles from '../../styles/Styles';
import ViewText from '../ViewText';

const ScaleQuestion = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    properties: React.PropTypes.shape({
      min: React.PropTypes.number.isRequired,
      max: React.PropTypes.number.isRequired,
      minText: React.PropTypes.text,
      maxText: React.PropTypes.text,
    }),
  },

  getDefaultProps() {
    return {
      value: 1,
      properties: {
        min: 0,
        max: 5,
      },
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
    };
  },

  /* Methods */
  handleChange(value) {
    this.setState({
      value: value,
    });
    this.props.onChange(value);
  },

  /* Render */
  renderNotes() {
    return this.props.notes.map((note, index) => {
      return (
        <Text key={`note-${this.props.id}-${index}`}>
          {note}
        </Text>
      );
    });
  },

  render() {
    const { properties } = this.props;
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <Text style={[Styles.type.h1, {textAlign: 'center'}]}>{this.state.value}</Text>
        <Slider
          value={this.state.value}
          minimumValue={properties.min}
          maximumValue={properties.max}
          step={1}
          onValueChange={this.handleChange}
          style={{marginHorizontal: 20}}
          />
        <View style={Styles.question.notes}>
          {
            properties.minText
            ? <Text style={[Styles.type.p, {textAlign: 'center'}]}>
                {properties.min}: {properties.minText}
              </Text>
            : null
          }
          {
            properties.maxText
            ? <Text style={[Styles.type.p, {textAlign: 'center'}]}>
                {properties.max}: {properties.maxText}
              </Text>
            : null
          }
        </View>
      </View>
    );
  },
});

module.exports = ScaleQuestion;
