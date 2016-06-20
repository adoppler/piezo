const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack')

module.exports = function plugins(conf) {
  if (conf.production) {
    const base = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        },
        __DEV__: false
      }),
      new ExtractTextPlugin('css/[contenthash].css', { allChunks: true }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
    ]

    if (conf.__serverRender) {
      return base
    }

    return base.concat(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        },
        comments: false,
        mangle: true,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        children: true,
        minChunks: 3
      }),
      // new webpack.optimize.MinChunkSizePlugin({
      //   minChunkSize: 16384 // TODO: broken
      // }),
      new webpack.HashedModuleIdsPlugin({}),
      new HtmlPlugin({
        template: conf.html.template ? path.join(conf.__root, conf.html.template) : path.join(__dirname, 'template.html'),
        filename: '../index.html',
        inject: true,
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true,
        }
      }),
      conf.webpack.plugins
    )
  }

  return [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.HashedModuleIdsPlugin({}),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      __DEV__: true
    }),
    new HappyPack({ id: 'js', verbose: false, tempDir: path.join(__dirname, '../tmp/happypack') })
  ].concat(conf.webpack.devPlugins || [])
}
