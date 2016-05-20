const path = require('path')
const webpack = require('webpack')

const config = require('../config')
const webpackConfig = require('../webpack/webpack-config')(config)
const compiler = webpack(webpackConfig)

const index = `<!doctype html>
<title>${config.html.title}</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<div id="react"></div>
<script src="${config.webpack.publicPath}${config.webpack.bundleName}.js"></script>
`

module.exports = function piezoDevServer(app) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler))

  app.get('*', (req, res) => res.send(index))
}
