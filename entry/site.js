import React from 'react'
import { render } from 'react-dom'
import { match, Router, browserHistory } from 'react-router'
import ready from 'doc-ready'

import routes from 'routes!pages'
import { routerProps, RootComponent } from 'index.js'

function go(routes) {
  match({ routes, location: window.location.pathname }, () => {
    const router = <Router {...routerProps} children={routes} history={browserHistory} />
    render(
      RootComponent ? <RootComponent>{router}</RootComponent> : router
    , document.getElementById('react'))
  })
}

ready(() => {
  go(routes)
})

// if (module.hot) {
//   module.hot.accept(['pages'], () => {
//     console.log('pages changed!!')
//     const newRoutes = require('routes!pages').default
//     go(newRoutes)
//   })
// }
