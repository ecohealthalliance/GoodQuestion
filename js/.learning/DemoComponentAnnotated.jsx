
// This is an organized 

const DemoComponentAnnotated = React.createClass({
  ////////////////   React Life cycle:
  // Life cycle //     This section encompasses all of the default life cycle methods from a React component.
  ////////////////     The standard React life cycle controls the process of rendering and updating the current component, as well as passes props to its child components.


  /* 
    Initialization
    These objects and methods define the initial attributes of a component before it begins its life cycle.
  */
    // This object allows you to validate props being passed to your components, as well as set requirements for the minimum amount of props the component needs to work.
    propTypes: {},
    // This method creates and caches an initial set of props when the class is created, before any other props are passed to the component. It's used for placeholding and setting defaults to allow for a less fragile coding style.
    getDefaultProps() { return {} },
    // Creates the State in which the component should be initialized with. State changes cause the component to be re-rendered.
    getInitialState() { return {} },

  

  /* 
    First Cycle / Mounting
    These methods only run when the component is first performing its first render.
  */
    // Method executed right BEFORE the component performs its first render.
    componentWillMount() {},
    // Method executed right AFTER the component performed its first render.
    componentDidMount() {},
    // Method executed before a component is deleted. Useful for unsubscribing from stores, unbinding variables, clearing timeouts, etc.
    componentWillUnmount() {},



  /* 
    Updating
    These methods execute as changes are made to a mounted component.
  */
    // This method triggers when a parent component sends new props to a child component.
    componentWillReceiveProps(next_props) {},
    // Method used for checking if a component should re-render or not, preventing render() from being called if false is returned. Defaults to true if omitted.
    shouldComponentUpdate() { return true },
    // Method executed BEFORE render() when a component updates. Does not trigger on the first cycle.
    componentWillUpdate(next_props, next_state) {},
    // Method executed AFTER render() when a component updates. Does not trigger on the first cycle.
    componentDidUpdate() {},




  ///////////// Component Methods:
  // Methods //   This section includes all of the component's custom methods.
  /////////////   For organizational purposes, methods that perform changes to the component which are not part of the React life cycle are placed here.



    // All methods declared inside this object can be accessed via the component's class. (See recommended reading #2)
    statics: {},

    exampleMethod1() {},
    exampleMethod2() {},



  ////////////  Rendering Methods:
  // Render //    This section includes all rendering methods.
  ////////////    Make new components if your secondary rendering methods ever become redundant.
  


    // Main rendering method. This is the only required method of a React component.
    render() { return <View></View> },



})

module.exports = DemoComponentAnnotated



/*
  ## Appendix ##

  ## Recommended reading ##
    1: props and propTypes:   https://facebook.github.io/react/docs/reusable-components.html
    2: static methods:        https://facebook.github.io/react/docs/component-specs.html#statics

  ## Life cycle cheat-sheet ##

    First Cycle:
      * The <DemoComponentAnnotate/> tag is inserted somewhere within your app.
      - getDefaultProps()
      - getInitialState()
      - componentWillMount()
      - render()
      - componentDidMount()

    Component Deletion:
      * The <DemoComponentAnnotated /> tag is removed.
      - componentWillUnmount()

    Updating the component via setState or Redux:
      * Component receives a change from it's store subscription.
      * OR
      * The this.setState() method is called somewhere within the component, passing an object with the new state to be set.
      - shouldComponentUpdate()
      - componentWillUpdate()
      - render()
      - componentDidUpdate()

    Updating via props:
      * A parent component changed the props of this already-mounted component.
      - componentWillReceiveProps()
      # Note: componentWillReceiveProps must call a method which triggers a re-render, otherwise nothing will happen. (such as this.setState)

*/