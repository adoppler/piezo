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
    publicPath: webpackConfig.output.publicPath,
    stats: {
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      modules: false,
      hash: false,
      version: false,
      timings: false,
      assets: false,
    }
  }))

  app.use(require('webpack-hot-middleware')(compiler))

  app.use(function(err, req, res, next) {
    console.log('FAIL', err)
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });

  app.get('*', (req, res) => res.send(index))
}
