/* eslint no-console: 0 */

const path = require('path')
const express = require('express')
const app = express()
const compression = require('compression')

const config = require(path.join(process.cwd(), 'piezo.config'))

const webpack = require('webpack')
const webpackConfig = require('./webpack-config')(config)

const production = process.env.NODE_ENV === 'production'

if (production) {
  app.use(compression())
  app.use(express.static(path.join(process.cwd(), 'www'), { maxAge: 31536000000 }))
} else {
  const compiler = webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler))

  const index = `<!doctype html>
<title>${config.html.defaultTitle}</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<div id="react"></div>
<script src="${config.webpack.publicPath}${config.webpack.bundleName}.js"></script>
`
  app.get('*', (req, res) => res.send(index))
}

const port = config.server.port || 8080
const host = config.server.host || 'localhost'

app.listen(port, host, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Listening at https://${host}:${port}`)
})
