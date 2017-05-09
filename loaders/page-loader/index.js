const Remarkable = require('remarkable')
const fm = require('front-matter')

const md = new Remarkable({
  xhtmlOut: true,
  linkify: true,
  typographer: true,
})

function PageComponent(props, layoutPath, child) {
  return `import React, { Component } from 'react'
  import Layout from '${layoutPath}'

  export default class Page extends Component {

    render() {
      return React.createElement(Layout, ${JSON.stringify(Object.assign({}, props, { layout: undefined }))}, ${child || 'null'})
    }
  }
  `
}

function createMarkdownComponent(src) {
  const matter = fm(src)
  const props = matter.attributes
  const html = md.render(matter.body).trim().replace(/\n/g, '\n        ')

  return PageComponent(props, props.layout, `<div>${html}</div>`)
}

function pageLoader(source) {
  this.cacheable()
  const extension = this.resourcePath.match(/\.(\w+)$/)[1]

  try {
    if (extension === 'md' || extension === 'markdown' || extension === 'mdown') {
      const src = eval(source.toString())
      return createMarkdownComponent.call(this, src)
    }
  } catch (e) {
    if (e instanceof SyntaxError || e.name === 'SyntaxError') {
      throw new SyntaxError(`Unable to parse ${this.resource.replace(this.context, '')} (${e.message} on line ${e.line})`)
    }
    throw e
  }


  return source
}

module.exports = pageLoader
module.exports.raw = true
