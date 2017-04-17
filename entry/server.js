import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router'
import Helmet from 'react-helmet'

import routes from 'routes-loader!pages'
import { RootComponent, rootProps } from './customizations'

import routesList from 'routes-loader?list!pages'
export { routesList as routes }

export function render(location) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error) {
        reject(error)
      } else {
        try {
          const router = <RouterContext {...renderProps} />
          const app = RootComponent ? <RootComponent {...rootProps}>{router}</RootComponent> : router

          const html = renderToString(app)
          const helmet = Helmet.renderStatic()

          if (html) {
            resolve({
              html,
              title: helmet.title.toString(),
              meta: helmet.meta.toString(),
              link: helmet.link.toString(),
              style: helmet.style.toString(),
              script: helmet.script.toString(),
            })
          } else {
            reject({ message: `Nothing to render for ${location}` })
          }
        } catch (rendererr) {
          reject(rendererr)
        }
      }
    })
  })
}
