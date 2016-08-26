const entry = require('./entry')
const loaders = require('./loaders')
const output = require('./output')
const plugins = require('./plugins')
const postcss = require('./postcss')

module.exports = function configureWebpack(options) {
  return {
    bail: options.production,
    devtool: options.production ? null : 'cheap-module-eval-source-map',
    entry: entry(options),
    module: {
      loaders: loaders(options),
    },
    output: output(options),
    plugins: plugins(options),
    postcss: postcss(options),
    quiet: true,
    resolve: {
      extensions: ['.js', '.json', '.css', '.sass', '.scss'],
      modules: [
        'node_modules',
        options.sourceDirectory,
      ],
    },
    target: options.serverRender ? 'node' : 'web',
  }
}
