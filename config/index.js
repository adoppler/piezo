const path = require('path')
const merge = require('lodash.merge')
const approot = require('app-root-path').path

const root = approot.match(/piezo$/) ? process.cwd() : approot

const config = require(path.join(root, 'piezo.config.js'))

const defaults = {
  html: {
    // topComment: ''
    title: 'Site',
    // template: '',
  },
  build: {
    source: './src',
    output: './dist'
  },
  webpack: {
    bundleName: 'app',
    publicPath: '/static/',
    plugins: [],
    devPlugins: [],
    loaders: [],
    postCssPlugins: [],
    // toolbox: {
    //   theme: 'src/theme.scss'
    // }
  },
  server: {
    hostname: 'localhost',
    port: 8080,
  },
  sitemap: {
    hostname: 'https://www.example.com',
  },
}

module.exports = merge(defaults, config, { __root: root })
