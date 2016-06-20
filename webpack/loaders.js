const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function loaders(conf) {
  const cssLoader = {
    test: /\.css$/,
    exclude: /node_modules/
  }
  const cssVendorLoader = {
    test: /\.css$/,
    include: /node_modules/
  }

  if (conf.production) {
    cssLoader.loader = ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[hash:base64]!postcss')
    cssVendorLoader.loader = ExtractTextPlugin.extract('style', 'css!postcss')
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
    cssVendorLoader.loaders = [
      'style?sourceMap',
      {
        loader: 'css-loader',
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

  const babelQuery = conf.babelQuery || {
    presets: [
      'react',
      'es2015-webpack',
      'stage-0',
      'react-hmre'
    ],
    env: {
      development: {
        presets: [
          'react-hmre'
        ]
      },
      production: {
        plugins: [
          'transform-react-remove-prop-types',
          'transform-react-pure-class-to-function',
        ],
      }
    },
    cacheDirectory: true
  }

  return [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      query: babelQuery,
      include: [
        path.resolve(conf.__root, conf.build.source),
        path.resolve(__dirname, '../entry')
      ],
      happy: { id: 'js' }
    },
    {
      test: /\.(md|markdown)$/,
      loaders: [
        { loader: 'babel?cacheDirectory', query: babelQuery },
        'page',
        'raw'
      ],
      include: path.resolve(conf.__root, conf.build.source, 'pages'),
    },
    cssLoader,
    cssVendorLoader,
    sassLoader,
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url?limit=2048,name=images/[name]-[hash].[ext]'
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
      loader: 'react-svg?es5=1'
    },
  ].concat(conf.webpack.loaders || [])
}
