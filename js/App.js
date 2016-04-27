import React from 'react-native'

const App = React.createClass ({
  propTypes: {
    platform: React.PropTypes.string.isRequired,
  },

  render() {
  	<App platform="android" style={Styles.container.wrapper}>
      {view}
    </App>
  }
})

module.exports = App
