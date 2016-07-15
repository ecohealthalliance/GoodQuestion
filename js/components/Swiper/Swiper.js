import React, {
  Animated,
  Dimensions,
  PanResponder,
  View,
} from 'react-native';

import Dots from './dots';

const Swiper = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    index: React.PropTypes.number,
    threshold: React.PropTypes.number,
    pager: React.PropTypes.bool,
    beforePageChange: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func.isRequired,
    dotContainerStyle: React.PropTypes.object,
    dotStyle: React.PropTypes.object,
    activeDotStyle: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      index: 0,
      pager: true,
      threshold: 25,
      activeDotColor: 'blue',
      containerStyle: {},
      dotContainerStyle: {},
      dotStyle: {},
      activeDotStyle: {},
      onPageChange: () => {},
      beforePageChange: () => {
        return true;
      },
    };
  },

  getInitialState() {
    return {
      index: this.props.index,
      scrollValue: new Animated.Value(this.props.index),
      viewWidth: Dimensions.get('window').width,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('index')) {
      const pageNumber = Math.max(0, Math.min(nextProps.index, this.props.children.length - 1));
      this.setState({
        index: pageNumber,
      });
      Animated.spring(this.state.scrollValue, {toValue: pageNumber, friction: this.props.springFriction, tension: this.props.springTension}).start();
    }
  },

  componentWillMount() {
    const release = (e, gestureState) => {
      const relativeGestureDistance = gestureState.dx / this.state.viewWidth;
      const { vx } = gestureState;

      let shouldContinue = false;
      const currentIndex = this.state.index;
      let newIndex = this.state.index;

      if (relativeGestureDistance < -0.2 || relativeGestureDistance < 0 && vx <= -0.2) {
        newIndex++;
        shouldContinue = this.shouldContinue(currentIndex, newIndex);
      } else if (relativeGestureDistance > 0.2 || relativeGestureDistance > 0 && vx >= 0.2) {
        newIndex--;
        shouldContinue = this.shouldContinue(currentIndex, newIndex);
      }

      if (!shouldContinue) {
        newIndex = currentIndex;
      }
      this.goToPage(newIndex);
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const {threshold} = this.props;

        // Only if it exceeds the threshold
        if (threshold - Math.abs(gestureState.dx) > 0) {
          return false;
        }

        // Claim responder if it's a horizontal pan
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          return true;
        }

        return false;
      },

      // Touch is released, scroll to the one that you're closest to
      onPanResponderRelease: release,
      onPanResponderTerminate: release,


      // Dragging, move the view with the touch
      onPanResponderMove: (e, gestureState) => {
        const dx = gestureState.dx;
        const offsetX = -dx / this.state.viewWidth + this.state.index;

        this.state.scrollValue.setValue(offsetX);
      },
    });
  },

  shouldContinue(currentPage, nextPage) {
    const shouldContinue = this.props.beforePageChange(currentPage, nextPage);
    if (typeof shouldContinue !== 'undefined' && !shouldContinue) {
      return false;
    }
    return true;
  },

  goToPage(pageNumber) {
    let num = pageNumber;
    // Don't scroll outside the bounds of the screens
    num = Math.max(0, Math.min(num, this.props.children.length - 1));
    this.setState({
      index: num,
    });

    Animated.spring(this.state.scrollValue, {toValue: num, friction: this.props.springFriction, tension: this.props.springTension}).start();
    this.props.onPageChange(num);
  },

  handleLayout(event) {
    const { width } = event.nativeEvent.layout;

    if (width) {
      this.setState({ viewWidth: width });
    }
  },

  renderDots() {
    if (this.props.pager) {
      return this.props.dots || <Dots
        active={ this.state.index }
        total={ this.props.children.length }
        style={this.props.dotContainerStyle}
        dotStyle={ this.props.dotStyle }
        activeDotStyle={ this.props.activeDotStyle }
        activeColor={ this.props.activeDotColor }
      />;
    }
  },

  render() {
    const scenes = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { style: [child.props.style, {flex: 1}] });
    });

    const translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.state.viewWidth],
    });

    const sceneContainerStyle = {
      width: this.state.viewWidth * this.props.children.length,
      flex: 1,
      flexDirection: 'row',
    };

    return (
      <View style={[{flex: 1, overflow: 'hidden'}, this.props.containerStyle]} onLayout={this.handleLayout}>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={[sceneContainerStyle, {transform: [{translateX}]}]}
        >
          { scenes }
        </Animated.View>

        { this.renderDots() }
      </View>
    );
  },
});

module.exports = Swiper;
