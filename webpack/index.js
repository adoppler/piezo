const entry = require('./entry')
const loaders = require('./loaders')
const output = require('./output')
const plugins = require('./plugins')

module.exports = function configureWebpack(options) {
  return Object.assign({
    bail: options.production,
    devtool: options.production ? false : 'cheap-module-eval-source-map',
    entry: entry(options),
    module: {
      rules: loaders(options),
    },
    output: output(options),
    plugins: plugins(options),
    performance: options.performance || {
      hints: options.production ? 'warning' : false,
      maxEntrypointSize: 500000,
      maxAssetSize: 500000,
    },
    resolve: {
      extensions: ['.js', '.json', '.css', '.sass', '.scss'],
      modules: [
        'node_modules',
        'web_modules',
        options.sourceDirectory,
      ],
    },
    node: {
      fs: 'empty',
      net: 'empty',
      dns: 'empty',
    },
    target: options.serverRender ? 'node' : 'web',
  }, options.webpackConfig)
}
