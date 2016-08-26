const express = require('express')
const config = require('../config')

const app = express()

const dev = require('./development')
const prod = require('./production')

if (config.devServerMiddleware) {
  config.devServerMiddleware.forEach(m => {
    app.use(...(Array.isArray(m) ? m : [m]))
  })
}

if (process.env.NODE_ENV === 'production') {
  prod(config, app)
} else {
  dev(config, app)
}

const hostname = config.devServerHostname
const port = config.devServerPort

app.listen(port, hostname, (err) => {
  if (err) {
    console.error(err) // eslint-disable-line no-console
    process.exit(1)
  } else if (config.production) {
    console.log(`Listening at ${hostname}:${port}`) // eslint-disable-line no-console
  }
})
