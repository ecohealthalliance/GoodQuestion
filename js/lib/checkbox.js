'use strict';
var React = require('react-native');
var {
    StyleSheetRegistry,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
    TouchableWithoutFeedback
} = React;

var flattenStyle = React.StyleSheet.flatten;
var PropTypes = React.PropTypes;

var CheckBox = React.createClass({
  propTypes: {
    label: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    uncheckedComponent: React.PropTypes.object,
    checkedComponent: React.PropTypes.object,
    style: React.View.propTypes.style,
    labelStyle: React.Text.propTypes.style,
    labelContainerStyle: React.View.propTypes.style,
    containerStyle: React.View.propTypes.style,
    labelBefore: PropTypes.bool,
    children: React.PropTypes.element,
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
    var checkboxStyles = flattenStyle([
      styles.checkbox,
      this.props.style,
    ]);

    var defaultCheckComponent = (<Image
        source={require('./check.png')}
        resizeMode="stretch"
        style={{
          width: imageWidth,
          height: imageHeight,
        }}
      />);

    var defaultUncheckComponent = (
        //<View style={[styles.checkbox, this.props.style]}>
        <View>
          {this.props.checked ? checkComponent : null}
        </View>
    );

    var uncheckedComponent = this.props.uncheckedComponent || defaultCheckComponent;
    var checkComponent = this.props.checkedComponent || defaultCheckComponent;
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
        {uncheckedComponent}
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

var defaultCheckboxBorderWidth = 2,
    defaultCheckboxWidth = 26;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: defaultCheckboxWidth,
    height: defaultCheckboxWidth,
    borderWidth: defaultCheckboxBorderWidth,
    borderRadius: 4,
    borderColor: 'black',
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
