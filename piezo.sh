#!/bin/bash

cd $PWD

case "$1" in
  build)
    test -d www && rm -r www
    test -d .tmp && rm -r .tmp
    cp -r src/www www

    if [ "$BUILD_ID" ] || [ "$TRAVIS" ]; then
      NODE_ENV=production webpack --config ./node_modules/piezo/webpack-config.js && NODE_ENV=production node ./node_modules/piezo/sitemap-generator.js || exit 1
    else
      NODE_ENV=production webpack --progress --config ./node_modules/piezo/webpack-config.js && NODE_ENV=production node ./node_modules/piezo/sitemap-generator.js || exit 1
    fi

    rm -r .tmp
    ;;
  clean)
    test -d www && rm -r www
    test -d .tmp && rm -r .tmp
    test -d dist && rm -r dist
    exit 0
    ;;
  server)
    node ./node_modules/piezo/server.js
    ;;
esac
