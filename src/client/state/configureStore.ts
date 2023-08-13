const env = process.env.NODE_ENV || 'production'

import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { applyMiddleware, createStore, StoreEnhancer } from 'redux'
import { rootReducer } from './index'

let middleware: StoreEnhancer

if (env === 'development')
  middleware = applyMiddleware(thunk, createLogger())

if (env === 'production')
  middleware = applyMiddleware(thunk)

const configureStore = (preloadedState: any) => (
  createStore(rootReducer, preloadedState, middleware)
)

export default configureStore