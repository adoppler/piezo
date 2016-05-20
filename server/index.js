const express = require('express')
const config = require('../config')

const app = express()

if (process.env.NODE_ENV === 'production') {
  require('./production')(app)
} else {
  require('./development')(app)
}

const port = config.server.port || 8080
const host = config.server.host || 'localhost'

app.listen(port, host, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Listening at https://${host}:${port}`)
})
