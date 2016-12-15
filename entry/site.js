import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory } from 'react-router'

import {
  routes as customRoutes,
  routerProps,
  RootComponent,
  rootProps
} from './customizations'

const routes = customRoutes || require('routes-loader!pages')

match({ routes, history: browserHistory }, (error, redirectLocation, renderProps) => {
  const router = <Router {...renderProps} {...routerProps} />

  render(
    RootComponent ? <RootComponent {...rootProps}>{router}</RootComponent> : router
  , document.getElementById('react'))
})
