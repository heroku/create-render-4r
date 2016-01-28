import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../common/store/configure-store'
import App from '../common/containers/app'

import { Router } from 'react-router'
import { createHistory, useQueries } from 'history'
import routes from '../common/routes'

const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState)
const history = useQueries(createHistory)()
const rootElement = document.getElementById('app')

render(
  <Provider store={store}>
    <Router
      children={routes}
      history={history}/>
  </Provider>,
  rootElement
)
