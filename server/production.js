const fs = require('fs')
const path = require('path')

const express = require('express')
const compression = require('compression')

const config = require('../config')

const root = path.join(config.__root, config.build.output)
const notFound = fs.readFileSync(path.join(root, '404.html')).toString()

module.exports = function piezoProdServer(app) {
  app.use(compression())
  app.use(express.static(root, { maxAge: 31536000000 }))
  app.get('*', (req, res) => res.send(404, notFound))
}
