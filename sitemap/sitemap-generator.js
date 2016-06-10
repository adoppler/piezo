'use strict';

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const beautify_html = require('js-beautify').html
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const sm = require('sitemap')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const config = require('../config')

const outputDir = path.join(path.join(config.__root, config.build.output))

function reduceRoutesToUrls(routes) {
  return [routes].reduce(function getChildren(acc, route) {
    const uri = route.path
    const parent = uri === '/' ? '' : uri

    if (route.childRoutes) {
      const children = route.childRoutes.map(getChildren.bind(null, acc)).map(child =>
        child.map(c => `${parent}/${c}`)
      )
      return [].concat.apply([uri], children)
    }

    return uri === '*' ? acc : acc.concat(uri)
  }, [])
}

var template
function wrapWithTemplate(data) {
  if (!template) {
    template = fs.readFileSync(path.join(outputDir, 'index.html')).toString()
  }

  const html = template.replace('{{meta}}', data.meta || '')
                        .replace('{{link}}', data.link || '')
                        .replace('{{script}}', data.script || '')
                        .replace('{{title}}', data.title || '')
                        .replace('{{topComment}}', config.html.topComment ? `<!-- ${config.html.topComment} -->\n` : '')
                        .replace(/\sdata\-react\-helmet="true"/g, '')
                        .replace(/><\/script>/g, ' async defer></script>')

  const pretty = beautify_html(html, {
    indent_size: 2,
    preserve_newlines: false,
    end_with_newline: true,
    brace_style: 'expand',
    extra_liners: [],
    wrap_line_length: 0,
  })

  return pretty.replace('{{html}}', data.html)
}

function makeRouteDirectory(route) {
  return new Promise((resolve, reject) => {
    const uri = route.substr(1)
    if (uri === '404') {
      resolve(path.join(outputDir, '404.html'))
    } else {
      const dir = path.join(outputDir, route.substr(1))

      mkdirp(dir, (direrr) => {
        if (direrr) {
          reject(direrr)
        } else {
          resolve(`${dir}/index.html`)
        }
      })
    }
  })
}

function writeHtmlFile(file, html) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, html, (fserr) => {
      if (fserr) {
        reject(fserr)
      } else {
        resolve()
      }
    })
  })
}

function writeFile(route, data) {
  makeRouteDirectory(route).then(file => {
    const html = wrapWithTemplate(data)
    if (html) {
      return writeHtmlFile(file, html)
    }
    return Promise.reject({ message: `No rendered HTML for ${route}` })
  })
}

function writeSitemap(routes) {
  return new Promise((resolve, reject) => {
    const sitemap = sm.createSitemap({
      hostname: config.sitemap.hostname,
      urls: routes.filter(r => !r.endsWith('404')).map(r => {
        const parts = r.split('/')
        const name = parts.length > 0 ? parts[parts.length - 1] : 'home'
        const base = path.join(config.__root, config.build.source, `pages/${name}`)

        let lastmodfile
        if (fs.existsSync(`${base}.js`)) {
          lastmodfile = `${base}.js`
        } else if (fs.existsSync(`${base}.md`)) {
          lastmodfile = `${base}.md`
        } else if (fs.existsSync(`${base}.mdown`)) {
          lastmodfile = `${base}.mdown`
        } else if (fs.existsSync(`${base}.markdown`)) {
          lastmodfile = `${base}.markdown`
        }

        return {
          lastmodfile,
          lastmodrealtime: true,
          changefreq: null,
          url: r,
        }
      })
    })

    const xml = beautify_html(sitemap.toString(), {
      indent_size: 2,
      preserve_newlines: false,
      wrap_line_length: 0,
    })

    fs.writeFile(path.join(outputDir, 'sitemap.xml'), xml, (fserr) => {
      if (fserr) { return reject(fserr) }
      resolve()
    })
  })
}

const webpackConfig = require('../webpack/webpack-config.js')(Object.assign({ __serverRender: true }, config))
const compiler = webpack(webpackConfig)

compiler.apply(
  new ProgressBarPlugin({
    format: '  server render  [:bar] :percent',
    clear: false,
    width: 60,
    summary: false
  })
)

module.exports = function generateSitemap(callback) {
  compiler.run((err, stats) => {
    if (err) { throw err }

    const tmp = path.resolve(config.__root, config.build.output, `.tmp`)
    const app = require(path.join(tmp, 'bundle.js'))
    const routes = reduceRoutesToUrls(app.routes)

    Promise.all(
      routes.map(route =>
        app.render(route)
        .then(data => {
          writeFile(route, data)
        })
        .catch(error => {
          console.log('Error Rendering Route', route, error)
          process.exit(1)
        })
      ).concat(writeSitemap(routes))
    )
    .then(() => {
      rimraf.sync(tmp)
      callback()
    })
    .catch(error => {
      callback(error)
    })
  })
}
