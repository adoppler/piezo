const path = require('path')

module.exports = function output(conf) {
  const target = path.join(conf.__root, conf.build.output, conf.webpack.publicPath)

  if (conf.__serverRender) {
    return {
      path: path.join(conf.__root, conf.build.output, '.tmp'),
      filename: `bundle.js`,
      publicPath: conf.webpack.publicPath,
      libraryTarget: 'commonjs2'
    }
  } else if (conf.production) {
    return {
      path: target,
      filename: 'js/[chunkhash].js',
      chunkFilename: 'js/[chunkhash].js',
      publicPath: conf.webpack.publicPath,
    }
  }

  return {
    path: target,
    filename: `${conf.webpack.bundleName}.js`,
    publicPath: conf.webpack.publicPath,
  }
}
