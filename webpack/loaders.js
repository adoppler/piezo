const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function configureWebpackLoaders(options) {
  const cssLoader = {
    test: /\.css$/,
    exclude: /(node_modules|\.global\.css)/,
  }
  const cssGlobalLoader = {
    test: /\.css$/,
    include: /(node_modules|\.global\.css)/,
  }

  if (options.production) {
    cssLoader.loader = ExtractTextPlugin.extract({
      loader: 'css?modules&importLoaders=1&localIdentName=[hash:base64:5]!postcss',
    })
    cssGlobalLoader.loader = ExtractTextPlugin.extract({
      loader: 'css!postcss',
    })
  } else {
    cssLoader.loaders = [
      'style?sourceMap',
      {
        loader: 'css-loader',
        query: {
          modules: true,
          importLoaders: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
          discardDuplicates: false,
        },
      },
      'postcss?sourceMap',
    ]
    cssGlobalLoader.loaders = [
      'style?sourceMap',
      {
        loader: 'css-loader',
        query: {
          discardDuplicates: false,
        },
      },
      'postcss?sourceMap',
    ]
  }

  const babelQuery = options.babelQuery || {
    presets: [
      'react',
      ['es2015', { loose: true, modules: false }],
      'stage-0',
    ],
    env: {
      development: {
        presets: [
          'react-hmre',
        ],
      },
      production: {
        plugins: [
          'transform-react-remove-prop-types',
          'transform-react-pure-class-to-function',
        ],
      },
    },
    cacheDirectory: true,
    compact: false,
  }

  return [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      query: babelQuery,
      include: [
        path.resolve(__dirname, '../entry'),
        path.resolve(options.appRoot, options.sourceDirectory),
        /node_modules/,
      ],
      happy: { id: 'js' },
    },
    cssLoader,
    cssGlobalLoader,
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url?limit=2048,name=images/[name]-[hash].[ext]',
    },
    {
      test: /\.(woff|woff2|ttf|eot|ico)$/,
      loader: 'file?name=fonts/[name]-[hash].[ext]',
    },
    {
      test: /\.json$/,
      loader: 'json',
    },
    {
      test: /\.html$/,
      loader: 'raw',
    },
    {
      test: /\.svg$/,
      loader: 'babel!react-svg',
    },
  ].concat(options.webpackLoaders || [])
}
