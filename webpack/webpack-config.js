'use strict' /* eslint strict: 0 */

const path = require('path')
const webpack = require('webpack')

const loaders = require('./loaders')
const entry = require('./entry')
const plugins = require('./plugins')
const output = require('./output')

module.exports = function webpackConfig(options) {
  const conf = Object.assign({
    production: process.env.NODE_ENV === 'production',
  }, options)

  return {
    devtool: conf.production ? false : 'cheap-module-eval-source-map',
    entry: entry(conf),
    module: {
      loaders: loaders(conf)
    },
    output: output(conf),
    plugins: plugins(conf),
    postcss: conf.webpack.postCssPlugins,
    resolve: {
      extensions: ['.js', '.json', '.css', '.sass', '.scss'],
      modules: [
        'node_modules',
        path.join(conf.__root, conf.build.source),
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, '../loaders')
      ],
    },
    stats: {
      children: !conf.production,
      assets: conf.production,
      chunks: conf.production,
    },
    noInfo: !conf.production,
    target: conf.__serverRender ? 'node' : 'web',
    toolbox: conf.webpack.toolbox,
    bail: conf.production,
    progress: conf.production,
  }
}
