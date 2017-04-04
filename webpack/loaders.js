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
      fallback: 'style-loader',
      use: 'css-loader?modules&importLoaders=1&localIdentName=[hash:base64:8]!postcss-loader',
    })
    cssGlobalLoader.loader = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader!postcss-loader',
    })
  } else {
    cssLoader.loader = [
      'style-loader?sourceMap',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
          discardDuplicates: false,
        },
      },
      'postcss-loader?sourceMap',
    ]
    cssGlobalLoader.loader = [
      'style-loader?sourceMap',
      {
        loader: 'css-loader',
        options: {
          discardDuplicates: false,
        },
      },
      'postcss-loader?sourceMap',
    ]
  }

  const babelQuery = options.babelQuery || {
    presets: [
      'react',
      ['latest', { loose: true, modules: false }],
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
          // 'transform-react-remove-prop-types', // TODO: breaks react-router
          'transform-react-pure-class-to-function',
        ],
      },
    },
    cacheDirectory: true,
    compact: false,
  }

  const babelInclude = [
    path.resolve(__dirname, '../entry'),
    path.resolve(options.appRoot, options.sourceDirectory),
  ]

  if (options.babelIncludeNodeModules) {
    babelInclude.push(/node_modules/)
  }

  return [
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: babelQuery,
      include: babelInclude,
    },
    cssLoader,
    cssGlobalLoader,
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=2048,name=images/[name]-[hash].[ext]',
    },
    {
      test: /\.(woff|woff2|ttf|eot|ico)$/,
      loader: 'file-loader?name=fonts/[name]-[hash].[ext]',
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.html$/,
      loader: 'raw-loader',
    },
  ].concat(options.webpackLoaders || [])
}
