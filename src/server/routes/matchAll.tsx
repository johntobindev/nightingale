import React from 'react'
import ReactDomServer from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import render from '../render'
import configureStore from '../../client/state/configureStore'
import App from '../../client/App'
import { Application } from 'express'

export default (app: Application) => {
  app.get('*', (req, res) => {
    const preloadedState = req.preloadedState
    const store = configureStore(preloadedState)
    const context= {}

    const html = ReactDomServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <HelmetProvider context={context}>
            <App/>
          </HelmetProvider>
        </StaticRouter>
      </Provider>,
    )

    const { helmet } = context as { helmet: any }

    res.send(render(html, preloadedState, helmet, res.locals.nonce))
  })
}