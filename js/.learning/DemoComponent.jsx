
const DemoComponent = React.createClass({
  /* Lifecycle */
	
  propTypes: {},
  getDefaultProps() { return {} },
  getInitialState() { return {} },

  componentWillMount() {},
  componentDidMount() {},
  componentWillUnmount() {},

  componentWillReceiveProps(next_props) {},
  shouldComponentUpdate(next_props, next_state) { return true },
  componentWillUpdate(next_props, next_state) {},
  componentDidUpdate(prev_props, prev_state) {},

  /* Methods */
	
	statics: {},

  /* Render */

  render() { return <View></View> },

})

module.exports = DemoComponent