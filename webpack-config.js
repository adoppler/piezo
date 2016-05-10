'use strict' /* eslint strict: 0 */

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const piezoConfig = require(path.join(process.cwd(), 'piezo.config'))

function loaders(conf) {
  const cssLoader = { test: /\.css$/ }

  if (conf.production) {
    cssLoader.loader = ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[hash:base64]!postcss')
  } else {
    cssLoader.loaders = [
      'style?sourceMap',
      {
        loader: 'css-loader',
        query: {
          modules: true,
          importLoaders: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        }
      },
      'postcss?sourceMap',
    ]
  }

  const sassLoader = { test: /\.s[ac]ss$/ }

  if (conf.production) {
    sassLoader.loader = ExtractTextPlugin.extract('style', `css?modules&importLoaders=1&localIdentName=[hash:base64]!postcss!sass${conf.webpack.toolbox ? '!toolbox' : ''}`)
  } else {
    sassLoader.loaders = [
      'style?sourceMap',
      {
        loader: 'css-loader',
        query: {
          modules: true,
          importLoaders: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        }
      },
      'postcss?sourceMap',
      'sass'
    ]
    if (conf.webpack.toolbox) {
      sassLoader.loaders.push('toolbox')
    }
  }

  return [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      include: [
        path.resolve(process.cwd(), 'src'),
        path.resolve(__dirname, './entry')
      ],
    },
    {
      test: /\.(md|markdown)$/,
      loader: 'babel!page!raw',
      include: path.resolve(process.cwd(), 'src/pages'),
    },
    cssLoader,
    sassLoader,
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url?limit=8192,name=images/[name]-[hash].[ext]'
    },
    {
      test: /\.(woff|woff2|ttf|eot|ico)$/,
      loader: 'file?name=fonts/[hash].[ext]'
    },
    {
      test: /\.json$/,
      loader: 'json'
    },
    {
      test: /\.html$/,
      loader: 'raw'
    },
    {
      test: /\.svg$/,
      loader: 'babel!react-svg'
    }
  ]
}

function entry(conf) {
  if (conf.serverRender) {
    return {
      bundle: path.join(__dirname, './entry/server'),
    }
  } else if (conf.production) {
    return {
      [conf.webpack.bundleName]: path.join(__dirname, './entry/site'),
    }
  }

  return [
    'webpack-hot-middleware/client',
    path.join(__dirname, './entry/site')
  ]
}

function plugins(conf) {
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

    if (conf.serverRender) {
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
      //   minChunkSize: 16384
      // }),
      new webpack.HashedModuleIdsPlugin({}),
      new HtmlPlugin({
        template: path.join(__dirname, 'template.html'),
        filename: '../index.html',
        inject: true,
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true,
        }
      }),
      ...conf.webpack.plugins
    )
  }

  return [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      __DEV__: true
    }),
  ]
}

function output(conf) {
  if (conf.serverRender) {
    return {
      path: path.resolve(process.cwd(), '.tmp'),
      filename: `${conf.webpack.bundleName}.js`,
      publicPath: conf.webpack.publicPath,
      libraryTarget: 'commonjs2'
    }
  } else if (conf.production) {
    return {
      path: path.resolve(process.cwd(), 'www', 'static'),
      filename: 'js/[chunkhash].js',
      chunkFilename: 'js/[chunkhash].js',
      publicPath: conf.webpack.publicPath,
    }
  }

  return {
    path: path.resolve(process.cwd(), 'www', 'static'),
    filename: `${conf.webpack.bundleName}.js`,
    publicPath: conf.webpack.publicPath,
  }
}

module.exports = function webpackConfig(options) {
  const conf = Object.assign({ production: process.env.NODE_ENV === 'production' }, piezoConfig, options)

  return {
    devtool: conf.production ? null : 'cheap-module-eval-source-map',
    entry: entry(conf),
    module: {
      loaders: loaders(conf)
    },
    output: output(conf),
    plugins: plugins(conf),
    postcss: conf.postcssPlugins,
    resolve: {
      extensions: ['.js', '.json', '.css', '.sass', '.scss'],
      modules: [
        'node_modules',
        path.resolve(process.cwd(), 'src'),
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, './loaders')
      ],
    },
    stats: {
      children: !conf.production,
      assets: conf.production,
      chunks: conf.production,
    },
    noInfo: !conf.production,
    target: conf.serverRender ? 'node' : 'web',
    toolbox: conf.webpack.toolbox
  }
}
