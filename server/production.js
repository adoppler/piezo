const fs = require('fs')
const path = require('path')

const express = require('express')

module.exports = function piezoServer(config, app) {
  let notFound
  try {
    notFound = fs.readFileSync(path.join(config.distDirectory, '404.html')).toString()
  } catch (e) {
    notFound = 'Not Found'
  }

  app.use(express.static(config.distDirectory, { maxAge: 31536000000 }))
  app.get('*', (req, res) => res.status(404).send(notFound))
}
