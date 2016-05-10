import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory } from 'react-router'
import ready from 'doc-ready'

import routes from 'babel!routes!pages'
import { routerProps, RootComponent } from 'index.js'

ready(() => {
  match({ routes, location: window.location.pathname }, () => {
    const router = <Router {...routerProps} children={routes} history={browserHistory} />
    render(
      RootComponent ? <RootComponent>{router}</RootComponent> : router
    , document.getElementById('react'))
  })
})
