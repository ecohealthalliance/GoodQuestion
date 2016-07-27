import React, {
  Text,
  View,
  Slider,
  Animated,
  Platform,
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
      scaleAnim: new Animated.Value(1),
    };
  },

  /* Methods */
  handleChange(value) {
    this.state.scaleAnim.setValue(1.3);
    this.setState({
      value: value,
    }, () => {
      Animated.spring(
        this.state.scaleAnim,
        {
          toValue: 1,
          friction: 4,
          tension: 10,
        }
      ).start();
    });
  },

  handleRelease(value) {
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

  renderSteps() {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        marginHorizontal: 40,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderColor: '#f00',
        height: 50,
      }}></View>
    );
  },

  render() {
    const { properties } = this.props;
    const sliderTextStyle = {
      position: 'absolute',
      top: Platform.OS === 'android' ? 5 : 10,
      textAlign: 'center',
    };
    return (
      <View style={Styles.question.block}>
        <ViewText
          style={Styles.question.header}
          textStyle={Styles.question.headerText}>
            Question #{this.props.index}
        </ViewText>
        <Text style={[Styles.type.h3, Styles.question.text]}>{this.props.text}</Text>
        <View style={{
          height: 60,
          marginBottom: 20,
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Animated.Text
            style={[{
              fontSize: 50,
              textAlign: 'center',
              transform: [
                {scale: this.state.scaleAnim},
              ],
            }]}
            >
            {this.state.value}
          </Animated.Text>
        </View>

        <View style={{flex: 1, height: 50, marginHorizontal: 20}}>
          <Text style={[sliderTextStyle, {left: 0}]}>{properties.min}</Text>
          <Slider
            value={properties.min}
            minimumValue={properties.min}
            maximumValue={properties.max}
            step={1}
            onValueChange={this.handleChange}
            onSlidingComplete={this.handleRelease}
            hitSlop={{
              top: 50,
              bottom: 50,
              left: 50,
              right: 50,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              marginHorizontal: 15,
            }}
            />
          <Text style={[sliderTextStyle, {right: 0}]}>{properties.max}</Text>
        </View>
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
