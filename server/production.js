const path = require('path')

const express = require('express')
const compression = require('compression')

const config = require('../config')
const notFound = path.join(config.__root, config.build.output, '404.html')

module.exports = function piezoProdServer(app) {
  app.use(compression())
  app.use(express.static(path.join(config.__root, config.build.output), { maxAge: 31536000000 }))
  app.get('*', (req, res) => res.send(notFound))
}
