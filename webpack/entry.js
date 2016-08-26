const path = require('path')

module.exports = function configureWebpackEntry(options) {
  if (options.serverRender) {
    return {
      bundle: path.join(__dirname, '../entry/server'),
    }
  } else if (options.production) {
    return {
      bundle: path.join(__dirname, '../entry/site'),
    }
  }

  return [
    'webpack-hot-middleware/client?reload=true&noInfo=true',
    path.join(__dirname, '../entry/site'),
  ]
}
