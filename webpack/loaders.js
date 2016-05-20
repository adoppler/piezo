const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function loaders(conf) {
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
        path.resolve(conf.__root, conf.build.source),
        path.resolve(__dirname, '../entry')
      ],
    },
    {
      test: /\.(md|markdown)$/,
      loader: 'babel!page!raw',
      include: path.resolve(conf.__root, conf.build.source, 'pages'),
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
    },
  ].concat(conf.webpack.loaders || [])
}
