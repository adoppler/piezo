# Piezo Documentation

### CLI

*Generate a minimal project setup*
```
npm install --save piezo react react-dom react-router
$(npm bin)/piezo init
```
or
```
npm install --save piezo react react-dom react-router redux react-redux
$(npm bin)/piezo init redux
```

*Start up in development mode*
```
$(npm bin)/piezo
$(npm bin)/piezo dashboard
````

*Build the site*
```
$(npm bin)/piezo build
$(npm bin)/piezo build --no-sitemap    # skip the sitemap.xml
$(npm bin)/piezo build --no-render     # skip the pre-rendering and only generate an index.html file
```

*Preview the finished site locally (not recommended for use production)*
```
$(npm bin)/piezo server
```

### Project Structure

Piezo makes some basic assumptions about your project setup:

```
dist/             // piezo will create this directory and output your compiled site here
src/              // all source code should live in this folder
  pages/          // everything in this folder will be transformed to a route or layout component
    index.js      // the index page for your site/app (REQUIRED)
```

Aside from src/pages/index.js you're free to structure your project however you'd like. You can optionally add:

```
src/
  pages/
    404.js        // add a 404 page at any level, this translates into a path="*" route
    _layout.js    // add a layout component at any level, this will wrap all sibling routes
  www/            // anything in this folder will be copied directly to the generated site, no webpack transforms
  index.html      // customize the build with a doT template file
  index.js        // customize the entry point of your application
piezo.config.js   // customize piezo

```

### Configuration

**src/index.js**

This file lets you hook into the app and routing process. If you're using react-redux, this is the place to set up your Provider.

```
export const routes = []          // if you want to define routes manually
export const routerProps = {}     // if you need a little more control over react-router
export const RootComponent        // wrap the entire app in another component
export const basename = '/app'    // if you're serving under a subdirectory
```

**piezo.config.js**

This file is optional. It should export a configuration object (must use commonjs exports).

```
module.exports = {
  homepage: '',                     // Set the base url of your site for sitemap generation
  sourceDirectory: 'src',           // Source directory  (relative to project root)
  distDirectory: 'dist',            // Target output directly (relative to project root)
  publicPath: '/static/',           // The uri for all generated assets
  webpackLoaders: [],               // Add any extra webpack loaders you might need
  webpackPlugins: [],               // Add any extra webpack plugins for all builds
  webpackProductionPlugins: [],     // Add any extra webpack plugins for your production build
  webpackDevPlugins: [],            // Add any extra webpack plugins for your development build
  webpackConfig: {},                // Extend the base webpack config
  postCSSPlugins: [],               // Piezo will use a default autoprefixer unless one is specified here
  autoprefixer: true,               // Set to false if you don't need postcss autoprefixer
  babelQuery: {},                   // Customize your babel configuration by extending the base babel query
  devServerMiddleware: [],          // Add any express middleware to help with development
  devServerHostname: 'localhost',
  devServerPort: '8080',
}
```
