#!/usr/bin/env node

const path = require('path')

const chalk = require('chalk')
const cpr = require('cpr')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const rimraf = require('rimraf')
const webpack = require('webpack')

const config = require('../config')
const generateSitemap = require('../sitemap/sitemap-generator')
const webpackConfig = require('../webpack/webpack-config.js')(config)

const input = path.join(config.__root, config.build.source)
const output = path.join(config.__root, config.build.output)

function init() {
  return new Promise((resolve, reject) => {
    cpr(path.join(__dirname, 'src'), input, err => {
      err ? reject(err) : resolve()
    })
  })
}

function clean() {
  return new Promise((resolve, reject) => {
    rimraf(output, err => {
      err ? reject(err) : resolve()
    })
  })
}

function copy(input, output) {
  return new Promise((resolve, reject) => {
    cpr(input, output, err => {
      err ? reject(err) : resolve()
    })
  })
}

function compile() {
  process.env['NODE_ENV'] = 'production'

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig)

    compiler.apply(
      new ProgressBarPlugin({
        format: '  webpack build  [:bar] :percent',
        clear: false,
        width: 60,
        summary: false
      })
    )

    compiler.run(err => {
      err ? reject(err) : resolve()
    })
  })
}

function render() {
  process.env['NODE_ENV'] = 'production'

  return new Promise((resolve, reject) => {
    generateSitemap(err => {
      err ? reject(err) : resolve()
    })
  })
}

function build() {
  const startTime = Date.now()
  console.log(chalk.green.bold(`Building static site...`), '\n')

  return clean()
    .then(() => copy(path.join(input, 'www'), output))
    .then(compile)
    .then(render)
    .then(() => {
      console.log(chalk.green.bold(`Success after (${(Date.now() - startTime) / 1000 + 's'})`))
    })
}

function cli(task) {
  switch (task) {
    case 'init':
      return init()
    case 'build':
      return build()
    case 'clean':
      return clean()
    case 'compile':
      return compile()
    case 'render':
      return render()
    case 'help':
      console.log('Usage: piezo [build|clean|compile|render|server]')
      process.exit(0)
    case 'server':
    default:
      require('../server')
      return new Promise(() => {})
  }
}

cli(process.argv[2])
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
