/* eslint-disable no-console, no-use-before-define */

import createRender4r from 'create-render-4r'

import path from 'path'
import Express from 'express'
import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configure-store'
import routes from '../common/routes'
import { fetchCounter } from '../common/api/counter'

const app = new Express()
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// Create the renderer.
var render4r = createRender4r({
  routes:       routes,
  createStore:  configureStore,
  layoutHtml:   renderFullPage
});

// This is fired every time the server side receives a request
app.use(render4r)

function renderFullPage(componentHTML, cleanInitialState, documentMeta) {
  return `
    <!doctype html>
    <html>
      <head>
        ${documentMeta}
      </head>
      <body>
        <div id="app">${componentHTML}</div>
        <script>
          window.__INITIAL_STATE__ = ${cleanInitialState};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
