const path = require('path')

module.exports = function configureWebpackOutput(options) {
  const target = path.join(options.distDirectory, options.publicPath)

  if (options.serverRender) {
    return {
      path: path.join(options.distDirectory, '.tmp'),
      filename: 'bundle.js',
      publicPath: options.publicPath,
      libraryTarget: 'commonjs2',
    }
  } else if (options.production) {
    return {
      path: target,
      filename: 'js/[chunkhash].js',
      chunkFilename: 'js/[chunkhash].js',
      publicPath: options.publicPath,
    }
  }

  return {
    path: target,
    filename: 'bundle.js',
    publicPath: options.publicPath,
  }
}
