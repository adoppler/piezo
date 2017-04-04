'use strict'

const fs = require('fs')
const path = require('path')
const merge = require('lodash.merge')
const rootPath = require('app-root-path').path
const defaultConfig = require('./default')

const appRoot = process.env.APP_ROOT || rootPath
const appPackage = require(path.join(appRoot, 'package.json'))
const customConfigPath = path.join(appRoot, 'piezo.config.js')

let customConfig = {}
if (fs.existsSync(customConfigPath)) {
  customConfig = require(customConfigPath) // eslint-disable-line
}

const conf = merge(defaultConfig, customConfig, {
  appRoot,
  production: process.env.NODE_ENV === 'production',
})

conf.sourceDirectory = path.join(conf.appRoot, conf.sourceDirectory)
conf.distDirectory = process.env.DIST_DIR || path.join(conf.appRoot, conf.distDirectory)
conf.__PIEZO_HAS_INDEX__ = fs.existsSync(path.join(conf.sourceDirectory, 'index.js')) // eslint-disable-line

if (!conf.htmlTemplate) {
  if (fs.existsSync(path.join(conf.sourceDirectory, 'index.html'))) {
    conf.htmlTemplate = path.join(conf.sourceDirectory, 'index.html')
  } else {
    conf.htmlTemplate = path.join(__dirname, '../entry/index.html')
  }
}

if (!conf.homepage) {
  conf.homepage = appPackage.homepage || 'https://www.example.com'
}

module.exports = conf
