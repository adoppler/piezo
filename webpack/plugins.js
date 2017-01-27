const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const configurePostCss = require('./postcss')

module.exports = function configureWebpackPlugins(options) {
  const loaderConfig = {
    options: {
      context: options.appRoot,
      postcss: configurePostCss(options),
    },
  }

  if (options.production) {
    const base = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
        __DEV__: false,
        __PIEZO_HAS_INDEX__: options.__PIEZO_HAS_INDEX__,  // eslint-disable-line
      }),
      new ExtractTextPlugin({ filename: 'css/[contenthash].css', allChunks: true }),
      new webpack.LoaderOptionsPlugin(Object.assign({}, loaderConfig, {
        minimize: true,
        debug: false,
      })),
    ]

    if (options.serverRender) {
      return base
    }

    return base.concat(
      new webpack.HashedModuleIdsPlugin({}),
      new webpack.optimize.CommonsChunkPlugin({
        children: true,
        minChunks: 3,
      }),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 16384,
      }),
      new webpack.optimize.UglifyJsPlugin({ // TODO: not working on commons chunk?
        compressor: {
          warnings: false,
        },
        comments: false,
        mangle: true,
        sourceMap: true,
      }),
      new HtmlPlugin({
        template: options.htmlTemplate,
        filename: '../index.html',
        inject: true,
        minify: {
          collapseWhitespace: false,
          preserveLineBreaks: true,
        },
      }),
      options.webpackProductionPlugins
    )
  }

  return [
    new webpack.HashedModuleIdsPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin(loaderConfig),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
      __DEV__: true,
      __PIEZO_HAS_INDEX__: options.__PIEZO_HAS_INDEX__, // eslint-disable-line
    }),
  ].concat(options.webpackDevPlugins || [])
}
