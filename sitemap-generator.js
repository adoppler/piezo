'use strict';
/* eslint no-console: 0 */

const beautify_html = require('js-beautify').html
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const sm = require('sitemap')
const webpack = require('webpack')

const config = require(path.join(process.cwd(), 'piezo.config'))
const webpackConfig = require('./webpack-config.js')(Object.assign({ serverRender: true }, config))

const www = path.join(path.join(process.cwd(), 'www'))
const template = fs.readFileSync(path.join(www, 'index.html')).toString()

function reduceRoutes(routes) {
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

function compileTemplate(data) {
  const html = template.replace('{{meta}}', data.meta || '')
                        .replace('{{link}}', data.link || '')
                        .replace('{{title}}', data.title || '')
                        .replace('{{topComment}}', config.html.topComment)

                        .replace(/\sdata\-react\-helmet="true"/g, '')
                        .replace(/><\/script>/g, ' defer></script>')

  const pretty = beautify_html(html, {
    indent_size: 2,
    preserve_newlines: false,
    end_with_newline: true,
    brace_style: 'expand',
    extra_liners: [],
    wrap_line_length: 0,
  })

  return pretty.replace('{{html}}', data.html)
                .replace(/class=""\s/g, '')
}

function makeRouteDirectory(route) {
  return new Promise((resolve, fail) => {
    const uri = route.substr(1)
    if (uri === '404') {
      resolve(path.join(www, '404.html'))
    } else {
      const dir = path.join(www, route.substr(1))

      mkdirp(dir, (direrr) => {
        if (direrr) {
          fail(direrr)
        } else {
          resolve(`${dir}/index.html`)
        }
      })
    }
  })
}

function writeHtmlFile(file, html) {
  return new Promise((resolve, fail) => {
    fs.writeFile(file, html, (fserr) => {
      if (fserr) {
        fail(fserr)
      } else {
        console.log(`wrote ${file.replace(www, '')}`)
        resolve()
      }
    })
  })
}

function writeFile(route, data) {
  makeRouteDirectory(route).then(file => {
    const html = compileTemplate(data)
    if (html) {
      return writeHtmlFile(file, html)
    }
    return Promise.reject({ message: `No rendered HTML for ${route}` })
  })
}

function writeSitemap(routes) {
  return new Promise((resolve, fail) => {
    const sitemap = sm.createSitemap({
      hostname: config.hostname,
      urls: routes.filter(r => !r.endsWith('404')).map(r => {
        const parts = r.split('/')
        const name = parts.length > 0 ? parts[parts.length - 1] : 'home'
        const base = path.join(process.cwd(), r.indexOf('blog') > -1 ? `../src/blog/${name}` : `../src/pages/${name}`) // TODO

        let lastmodfile
        if (fs.existsSync(`${base}.js`)) {
          lastmodfile = `${base}.js`
        } else if (fs.existsSync(`${base}.md`)) {
          lastmodfile = `${base}.md`
        } else if (fs.existsSync(`${base}.mdown`)) {
          lastmodfile = `${base}.mdown`
        } else if (fs.existsSync(`${base}.markdown`)) {
          lastmodfile = `${base}.markdown`
        } else if (fs.existsSync(`${base}.toml`)) {
          lastmodfile = `${base}.toml`
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

    fs.writeFile(path.join(www, 'sitemap.xml'), xml, (fserr) => {
      if (fserr) { return fail(fserr) }
      console.log('wrote /sitemap.xml')
      resolve()
    })
  })
}

console.log('Rendering routes...')

webpack(webpackConfig, (err, stats) => {
  if (err) { throw err }
  const app = require(path.resolve(process.cwd(), `.tmp/${config.webpack.bundleName}.js`))
  const routes = reduceRoutes(app.routes)

  Promise.all(routes.map(route =>
    app.render(route)
      .then(data => writeFile(route, data))
      .catch(error => console.log('Error Rendering Route', route, error))
  ).concat(writeSitemap(routes)))
  .catch(error => console.error(error) || process.exit(1))
})
