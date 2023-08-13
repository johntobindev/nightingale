import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './state/configureStore'
import ClientWrapper from './ClientWrapper'
import './styles/vendor.ts'
import './styles/globals.scss'
import { HelmetProvider } from 'react-helmet-async'

declare global {
  interface Window {
    __PRELOADED_STATE__: any,
  }
}

const { __PRELOADED_STATE__: preloadedState } = window
const store = configureStore(preloadedState)
const root = document.querySelector('#root')

if (root === null)
  throw new Error('no root element')

render(
  <Provider store={store}>
    <HelmetProvider>
      <ClientWrapper/>
    </HelmetProvider>
  </Provider>,
  root,
)

if (module.hot) {
  module.hot.accept('./ClientWrapper', () => {
    const NextClient = require('./ClientWrapper').default

    render(
      <Provider store={store}>
        <HelmetProvider>
          <NextClient/>
        </HelmetProvider>
      </Provider>,
      root,
    )
  })
}