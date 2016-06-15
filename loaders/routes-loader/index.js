'use strict'

const dtree = require('directory-tree')

function isIndex(file) {
  return file.name.startsWith('index.')
}

function isLayout(file) {
  return file.name.startsWith('_layout.')
}

function is404(file) {
  return file.name.startsWith('404.') || file.name.startsWith('*.')
}

function isRoute(file) {
  return !isIndex(file) && !isLayout(file) && !file.name.startsWith('_')
}

function getComponent(path) {
  return `
  getComponent(nextState, cb) {
    System.import('${path}')
      .then(page => {
        cb(null, page.default)
      }, error => {
        if (console && typeof console.error === 'function') {
          console.error('Error while loading route component from ${path}', error)
        }
        cb(error, null)
      })
  },
  `
}

function fileToRoute(file, parent) {
  if (file.children !== undefined) {
    return dirToRoutes.call(this, file, `${parent}/`)
  }

  const name = file.name.replace(parent, '').split('.')[0]
  const path = name === 'index' ? '' : `path: "${name}",`
  const componentPath = `${parent || ''}/${file.name}`

  this.addDependency(file.path)

  return `{
    ${path}
    ${getComponent(componentPath)}
  }
`
}

function dirToRoutes(dir, parent) {
  const index = dir.children.find(isIndex)
  const layout = dir.children.find(isLayout)
  const notFound = dir.children.find(is404)
  const children = dir.children ? dir.children.filter(isRoute) : null

  const current = (parent || '') + dir.name

  const layoutComponent = layout ? getComponent(`${current}/${layout.name}`) : ''

  const routes = children.map(c => fileToRoute.call(this, c, current))

  if (notFound) {
    routes.push(`{
      path: '*',
      ${getComponent(`${current}/${notFound.name}`)}
    }`)
  }

  if (index) { this.addDependency(index.path) }
  if (notFound) { this.addDependency(notFound.path) }
  if (layout) { this.addDependency(layout.path) }

  const childRoutes = children ? `childRoutes: [${routes.join(',\n')}],` : ''
  const indexRoute = index ? `indexRoute: ${fileToRoute.call(this, index, current)},` : ''

  return `{
    ${layoutComponent}
    path: "${parent ? dir.name : '/'}",
    ${indexRoute}
    ${childRoutes}
  }`
}

module.exports = function routesLoader(source) {
  const root = this.resourcePath.replace(/\/([^\/]*)$/, '')
  const tree = dtree(root)
  const routes = dirToRoutes.call(this, tree)

  this.addContextDependency(root)
  this.cacheable()

  return `module.exports = ${routes};`
}
