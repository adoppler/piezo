# piezo

Charge up your react workflow without a boilerplate or complex configuration.

### What is it?

Piezo is a command line tool that simplifies react development. Piezo wraps babel, webpack, react-router, and more into a single dependency.

Piezo helps you build a React powered static website ready to deploy anywhere, no server required. All pages are pre-rendered for fast load times and SEO, then React takes over on the client for navigation without a page reload.

Piezo also works well for dynamic applications. You can focus on adding features, not managing build processes.

### Features

Development:

* Hot reloading of your entire application (instant feedback)
* Auto-detected routes (zero react-router setup)
* Imports resolved relative to your src directory (no more ../../../)
* Webpack Dashboard (friendly interface to Webpack's output)

Production:

* Compilation, minification, and react optimizations
* Bundle splitting
* Pre-rendering (host your entire site on S3)
* Hashed assets for optimal caching
* Sitemap.xml generation

### Usage

```
npm init
npm install --save piezo react react-dom react-router
$(npm bin)/piezo init
$(npm bin)/piezo
???
$(npm bin)/piezo build
```

For more info, see the [the documentation](./DOCUMENTATION.md).

### How does this work?

Piezo builds on many powerful tools including:

* [babel](https://github.com/babel/babel)
* [css-modules](https://github.com/css-modules/css-modules)
* [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
* [react](https://github.com/facebook/react)
* [react-helmet](https://github.com/nfl/react-helmet)
* [react-router](https://github.com/rackt/react-router)
* [routes-loader](https://github.com/adoppler/routes-loader)
* [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard)
* [webpack](https://github.com/webpack/webpack)

### Project Status

Piezo is already being used for customer-facing sites and applications. However, piezo is still in an early state of development and relies on some libraries in beta (particularly webpack 2.0).

Piezo requires Node v4 and up. Piezo has not been tested on Windows yet.

### Other interesting projects

If you're new to React and want an even simpler tool, use https://github.com/facebookincubator/create-react-app

If you need an advanced server rendering setup, check out https://github.com/redfin/react-server

### Contributing

Feedback and PRs welcome!
