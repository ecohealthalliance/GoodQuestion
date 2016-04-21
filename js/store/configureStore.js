import { createStore, combineReducers } from 'redux'
import NavigationReducer from '../reducers/NavigationReducer'

const configureStore = (initialState) => {
  const store = createStore(
    combineReducers({
      navigation: NavigationReducer,
    })
  )

  return store
}

module.exports = configureStore;