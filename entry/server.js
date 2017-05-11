import React from 'react'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'

import * as ServerApp from 'server'

export const routes = ServerApp.routes

export function render(location) {
  const html = renderToString(ServerApp.render(location))

  if (!html) {
    return Promise.reject({ location, message: 'Render Failed' })
  }

  const helmet = Helmet.renderStatic()

  return Promise.resolve({
    html,
    title: helmet.title.toString(),
    meta: helmet.meta.toString(),
    link: helmet.link.toString(),
    style: helmet.style.toString(),
    script: helmet.script.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
    htmlAttributes: helmet.htmlAttributes.toString(),
  })
}
