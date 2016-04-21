const NavigationReducer = function (state = {
  loading_app: true,

  view: 'home',
  tab: '',
}, action) {
  var ap = action.params

  switch (action.type) {
    // Navigates to a view, page, or tab.
    case 'NAVIGATION_SELECT_VIEW': return _.merge({}, state, {
      view: ap.view,
      tab: ap.tab ? ap.tab : '',
    })
    
    // Resets the view back to original values.
    case 'NAVIGATION_RESET': 
      return {
        loading_app: false,
        view: 'home',
        tab: '',
      }

    // Defaults.
    default: return state
  }
}

module.exports = NavigationReducer