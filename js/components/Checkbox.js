'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheetRegistry,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
    TouchableWithoutFeedback
} = ReactNative;

var flattenStyle = ReactNative.StyleSheet.flatten;
var PropTypes = React.PropTypes;

var CheckBox = React.createClass({
  propTypes: {
    label: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    uncheckedComponent: PropTypes.object,
    checkedComponent: PropTypes.object,
    labelStyle: ReactNative.Text.propTypes.style,
    labelContainerStyle: ReactNative.View.propTypes.style,
    containerStyle: ReactNative.View.propTypes.style,
    labelBefore: PropTypes.bool,
    children: PropTypes.element,
    highlight: PropTypes.bool
  },

  getDefaultProps() {
    return {
      label: null,
      labelBefore: false,
      checked: false,
      highlight: true
    }
  },

  onChange() {
    if(this.props.onChange){
      this.props.onChange(!this.props.checked);
    }
  },

  render() {
    if (!this.props.uncheckedComponent) {
      throw new Error('CheckBox requires a property for checkedComponent')
    }
    if (!this.props.checkedComponent) {
      throw new Error('CheckBox requires a property for uncheckedComponent')
    }

    var checkbox;
    if (this.props.checked) {
      checkbox = this.props.checkedComponent;
    } else {
      checkbox = this.props.uncheckedComponent;
    }

    var labelContainer;
    if (this.props.label) {
      labelContainer = (
        <View style={[styles.labelContainer, this.props.labelContainerStyle]}>
          <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
        </View>
      );
    } else if (this.props.children) {
      labelContainer = (
        <View style={[styles.labelContainer, this.props.labelContainerStyle]}>
          {this.props.children}
        </View>
      )
    } else {
      labelContainer = null;
    }

    var containerStyle = [
        styles.container,
        this.props.containerStyle
    ];

    var container = (
      <View style={containerStyle}>
        {checkbox}
        {labelContainer}
      </View>
    );

    if (this.props.labelBefore) {
      container = (
        <View style={containerStyle}>
          {labelContainer}
          {checkbox}
        </View>
      );
    }

    if (this.props.highlight) {
      return (
        <TouchableHighlight onPress={this.onChange} underlayColor='white'>
          {container}
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={this.onChange}>
          {container}
        </TouchableWithoutFeedback>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    fontSize: 15,
    lineHeight: 15,
    color: 'grey',
  },
});

module.exports = CheckBox;
