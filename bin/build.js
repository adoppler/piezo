/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

const cpr = require('cpr')
const minimist = require('minimist')
const rimraf = require('rimraf')
const webpack = require('webpack')

const sitemapRenderer = require('sitemap-renderer')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const config = require('../config')
const webpackConfigurator = require('../webpack')

function clean(target) {
  return new Promise((resolve, reject) => {
    rimraf(target, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function copy(from, to) {
  return new Promise((resolve, reject) => {
    fs.exists(from, exists => {
      if (exists) {
        cpr(from, to, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  })
}

function promiseToCompile(conf, plugins) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(conf)

    if (plugins) {
      plugins.forEach(p => {
        compiler.apply(p)
      })
    }

    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}

function compileSite(args, conf) {
  return promiseToCompile(conf, [
    new ProgressBarPlugin({
      format: '  webpack build  [:bar] :percent',
      clear: false,
      width: 60,
      summary: false,
    }),
  ]).then(stats => {
    if (stats.compilation.warnings) {
      stats.compilation.warnings.forEach(warning => {
        console.warn(`${warning.message.trim()}\n`)
      })
    }
  })
}

function compileServerBundle(args, conf) {
  if (!args.render) {
    return Promise.resolve()
  }

  return promiseToCompile(conf, [
    new ProgressBarPlugin({
      format: '  server render  [:bar] :percent',
      clear: false,
      width: 60,
      summary: false,
    }),
  ])
}

function renderSite(args, conf, hostname, dist) {
  const tmpdir = conf.output.path
  const template = path.join(tmpdir, '..', conf.output.publicPath, '../index.html')

  if (args.render) {
    const { routes, render } = require(path.join(tmpdir, conf.output.filename)) // eslint-disable-line global-require

    return sitemapRenderer.renderSite({
      render,
      template,
      output: path.join(template, '..'),
      hostname,
      pages: routes.map(r => ({ uri: r.path, file: r.file })),
      skipSitemap: !args.sitemap,
    }).then(() =>
      clean(tmpdir)
    )
  }

  const render = () => {
    return {
      meta: '',
      link: '',
      title: '',
      html: '',
    }
  }

  return sitemapRenderer.renderSite({
    render,
    template,
    output: path.join(template, '..'),
    hostname,
    pages: [{ uri: '/', file: 'index.html' }],
    skipSitemap: !args.sitemap,
  }).then(() =>
    clean(tmpdir)
  )
}

const argv = minimist(process.argv.slice(3), {
  default: {
    sitemap: true,
    render: true,
  },
})

const webpackConfig = webpackConfigurator(config)
const webpackServerConfig = webpackConfigurator(Object.assign({}, config, { serverRender: true }))

const output = webpackConfig.output.path
const input = config.sourceDirectory


clean(config.distDirectory)
  .then(() => copy(path.join(input, 'www'), path.join(output, '..')))
  .then(() => compileSite(argv, webpackConfig))
  .then(() => compileServerBundle(argv, webpackServerConfig))
  .then(() => renderSite(argv, webpackServerConfig, config.homepage, config.distDirectory))
  .then(() => {
    console.log('  finished') // eslint-disable-line no-console
  })
  .catch(err => {
    console.error(err) // eslint-disable-line no-console
    throw err
  })
