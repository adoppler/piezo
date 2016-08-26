import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory } from 'react-router'
import ready from 'doc-ready'

import {
  routes as customRoutes,
  routerProps,
  RootComponent,
  rootProps
} from './customizations'

const routes = customRoutes || require('routes!pages')

ready(() => {
  const router = <Router {...routerProps} children={routes} history={browserHistory} />

  render(
    RootComponent ? <RootComponent {...rootProps}>{router}</RootComponent> : router
  , document.getElementById('react'))
})
