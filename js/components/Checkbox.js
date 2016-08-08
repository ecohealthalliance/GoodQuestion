import React from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';

const PropTypes = React.PropTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    lineHeight: 15,
    color: 'grey',
  },
});

const Checkbox = React.createClass({
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
    highlight: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      label: null,
      labelBefore: false,
      checked: false,
      highlight: true,
    };
  },

  onChange() {
    if (this.props.onChange) {
      this.props.onChange(!this.props.checked);
    }
  },

  render() {
    if (!this.props.uncheckedComponent) {
      throw new Error('Checkbox requires a property for checkedComponent');
    }
    if (!this.props.checkedComponent) {
      throw new Error('Checkbox requires a property for uncheckedComponent');
    }

    let checkbox = null;
    if (this.props.checked) {
      checkbox = this.props.checkedComponent;
    } else {
      checkbox = this.props.uncheckedComponent;
    }

    let labelContainer = null;
    if (this.props.label) {
      labelContainer = <View style={[styles.labelContainer, this.props.labelContainerStyle]}>
                         <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
                       </View>;
    } else if (this.props.children) {
      labelContainer = <View style={[styles.labelContainer, this.props.labelContainerStyle]}>
                         {this.props.children}
                       </View>;
    }

    let container = <View style={[styles.container, this.props.containerStyle]}>
                      {checkbox}
                      {labelContainer}
                    </View>;

    if (this.props.labelBefore) {
      container = <View style={[styles.container, this.props.containerStyle]}>
                    {labelContainer}
                    {checkbox}
                  </View>;
    }

    if (this.props.highlight) {
      return (
        <TouchableHighlight onPress={this.onChange} underlayColor='white'>
          {container}
        </TouchableHighlight>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this.onChange}>
        {container}
      </TouchableWithoutFeedback>
    );
  },
});

module.exports = Checkbox;
