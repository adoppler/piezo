const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')

module.exports = function piezoDevServer(config, app) {
  const webpackConfig = require('../webpack')(config) // eslint-disable-line

  const compiler = webpack(webpackConfig)

  compiler.apply(new DashboardPlugin())

  app.use(require('webpack-dev-middleware')(compiler, {  // eslint-disable-line
    quiet: true,
    publicPath: webpackConfig.output.publicPath,
  }))

  app.use(require('webpack-hot-middleware')(compiler, {  // eslint-disable-line
    log: () => {},
  }))

  app.use((err, req, res, next) => {  // eslint-disable-line
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err,
    })
  })

  const index = `<!doctype html>
  <title>App</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <div id="react"></div>
  <script src="${webpackConfig.output.publicPath}bundle.js"></script>
  `

  app.get('*', (req, res) => res.send(index))
}
