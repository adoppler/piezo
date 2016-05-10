const dtree = require('directory-tree')

function isIndex(file) {
  return file.name.startsWith('index.')
}

function isNotIndex(file) {
  return !isIndex(file)
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
    return dirToRoutes(file, `${parent}/`)
  }

  const name = file.name.replace(parent, '').split('.')[0]
  const path = name === 'index' ? '' : `path: "${name}",`
  const componentPath = `${parent || ''}/${file.name}`

  return `{
    ${path}
    ${getComponent(componentPath)}
  }
`
}

function dirToRoutes(dir, parent) {
  const index = dir.children.find(isIndex)
  const children = dir.children ? dir.children.filter(isNotIndex) : null

  const current = (parent || '') + dir.name
  const component = parent ? '' : getComponent('layouts')

  const routes = children.map(c => fileToRoute(c, current))

  if (!parent) {
    routes.push(`{
      path: '*',
      ${getComponent('pages/404')}
    }`)
  }

  const childRoutes = children ? `childRoutes: [${routes.join(',\n')}],` : ''
  const indexRoute = index ? `indexRoute: ${fileToRoute(index, current)},` : ''

  return `{
    ${component}
    path: "${parent ? dir.name : '/'}",
    ${indexRoute}
    ${childRoutes}
  }`
}

module.exports = function routesLoader(source) {
  const root = this.resourcePath.replace(/\/([^\/]*)$/, '')
  const tree = dtree(root)
  const routes = dirToRoutes(tree)

  this.addContextDependency(root)
  this.cacheable()

  return `module.exports = ${routes};`
}
