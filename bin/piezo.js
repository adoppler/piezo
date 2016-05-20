#!/usr/bin/env node

const path = require('path')

const task = args = process.argv[2]
const config = require('../config')

const input = path.join(config.__root, config.build.source)
const output = path.join(config.__root, config.build.output)

function clean(cb) {
  const rimraf = require('rimraf')

  rimraf(output, (err) => {
    if (err) {
      throw err
    }
    cb()
  })
}


function build() {
  process.env['NODE_ENV'] = 'production'

  const cpr = require('cpr')
  const webpack = require('webpack')
  const webpackConfig = require('../webpack/webpack-config.js')(config)

  clean(() => {
    cpr(path.join(input, 'www'), output, (err) => {
      if (err) { throw err }
      webpack(webpackConfig, (err) => {
        if (err) { throw err }
        require('../sitemap/sitemap-generator')
      })
    })
  })
}

switch (task) {
  case 'build':
    build()
    break
  case 'clean':
    clean(() => process.exit(0))
    break
  case 'server':
    require('../server')
    break
  default:
    console.log('Usage: piezo [build|clean|server]')
    process.exit(1)
}
