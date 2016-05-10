import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router'
import Helmet from 'react-helmet'

import routes from 'babel!routes!pages'
import { RootComponent } from 'index.js'

export { routes }

export function render(location) {
  return new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (error) {
        reject(error)
      } else {
        try {
          const router = <RouterContext {...renderProps} />
          const app = RootComponent ? <RootComponent>{router}</RootComponent> : router

          const html = renderToString(app)
          const head = Helmet.rewind()

          if (html) {
            resolve({ html, title: head.title.toString(), meta: head.meta.toString(), link: head.link.toString() })
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
