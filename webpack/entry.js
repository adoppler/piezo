const path = require('path')

module.exports = function entry(conf) {
  if (conf.__serverRender) {
    return {
      bundle: path.join(__dirname, '../entry/server'),
    }
  } else if (conf.production) {
    return {
      [conf.webpack.bundleName]: path.join(__dirname, '../entry/site'),
    }
  }

  return [
    'webpack-hot-middleware/client',
    path.join(__dirname, '../entry/site')
  ]
}
