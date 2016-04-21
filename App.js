import React from 'react-native'

const App = React.createClass ({
  propTypes: {
    platform: React.PropTypes.string.isRequired,
  },

  render() {
    return this.props.children
  }
})

module.exports = App
