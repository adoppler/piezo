import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory } from 'react-router'
import { useBasename } from 'history'

import {
  routes as customRoutes,
  routerProps,
  RootComponent,
  rootProps,
  basename,
} from './customizations'

const routes = customRoutes || require('routes-loader!pages')
const history = !basename ? browserHistory : useBasename(() => browserHistory)({ basename })

match({ routes, history: history || browserHistory }, (error, redirectLocation, renderProps) => {
  renderProps.history = history
  renderProps.router = { ...renderProps.router, ...renderProps.history }

  const router = <Router {...renderProps} {...routerProps} />

  render(
    RootComponent ? <RootComponent {...rootProps}>{router}</RootComponent> : router
  , document.getElementById('react'))
})
