#!/usr/bin/env node

const chalk = require('chalk')
const path = require('path')

const task = args = process.argv[2]
const config = require('../config')

const input = path.join(config.__root, config.build.source)
const output = path.join(config.__root, config.build.output)

function checkError(err) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

function clean(cb) {
  const rimraf = require('rimraf')

  rimraf(output, (err) => {
    checkError(err)
    cb()
  })
}

function build() {
  process.env['NODE_ENV'] = 'production'

  const cpr = require('cpr')
  const webpack = require('webpack')
  const webpackConfig = require('../webpack/webpack-config.js')(config)
  const ProgressBarPlugin = require('progress-bar-webpack-plugin')
  const generateSitemap = require('../sitemap/sitemap-generator')

  const startTime = Date.now()

  console.log(chalk.green.bold(`Building static site...`), '\n')

  clean(() => {
    cpr(path.join(input, 'www'), output, (cprError) => {
      checkError(cprError)

      const compiler = webpack(webpackConfig)

      compiler.apply(
        new ProgressBarPlugin({
          format: '  webpack build  [:bar] :percent',
          clear: false,
          width: 60,
          summary: false
        })
      )

      compiler.run((webpackError) => {
        checkError(webpackError)

        generateSitemap((sitemapError) => {
          checkError(sitemapError)

          console.log(chalk.green.bold(`Success after (${(Date.now() - startTime) / 1000 + 's'})`))
        })
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
