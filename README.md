# piezo

## What is it?

piezo is a static site generator library that:

* Converts a directory of js or plain text files to a single-page site with a fallback to pre-rendered html
* Outputs a fully static site (complete with an updated sitemap.xml) that is SEO friendly and ready to deploy on any web host
* Automatically optimizes your production app with best practices like minification and code splitting

piezo optimized your workflow by:

* Encouraging code reuse via React components
* Hot reloading your entire site in development mode

## Ease of use

piezo is designed to allow developers and non-developers to collaborate on a website.

piezo requires no complex webpack or routing configuration, you only need to provide a very simple project structure

## What about other static generators?

Many other react-powered static site generators blur the lines between a library and a boilerplate.

piezo aims to handle the low level generation logic and provide a strong foundation for your own site with minimal configuration.

## Should I use piezo?

If you'd like to build a site using:

* react + react-router
* es2016 + webpack 2.0 (with tree shaking)
* postcss + css modules

And not worry about configuration, piezo might be a good fit.

If you're looking for a slightly different react-powered static site, check out:

https://github.com/gatsbyjs/gatsby
https://github.com/antwarjs/antwar
https://github.com/MoOx/phenomic
https://github.com/jakedeichert/rovr
https://github.com/andreypopp/sitegen
https://github.com/rpearce/react-static
https://github.com/allanhortle/stalactite

Please note that piezo is still very much in alpha mode.

## Setup

Add a piezo.config.js file to the root of your repo. This file should export a configuration object,

```
module.exports = {
  html: {
    title: '',                  // default page title
    template: '',               // path to html template file (optional)
    topComment: ''              // add a comment to the top of every html file (optional)
  },
  build: {
    source: '',                 // path to source directory (default './src')
    output: ''                  // path to build target (default './dist')
  },
  webpack: {
    bundleName: '',             // base name for js bundle (default 'app')
    publicPath: '',             // webpack public path (default '/static/')
    plugins: [],                // require any additional webpack plugins to include in the production build (optional)
    devPlugins: [],             // require any additional webpack plugins to include in development mode (optional)
    loaders: [],                // require any additional webpack loaders (optional)
    postCssPlugins: [],         // array of PostCSS plugins (optional, recommend autoprefixer at a minimum)
  },
  server: {
    host: 'localhost',          // development server hostname (default localhost)
    port: 8080,                 // development server port (default 8080)
  },
  sitemap: {
    hostname: '',               // url of your site (used for sitemap generation)
  }
}

```

`${config.boud.source}/index.js` can also export a few items to extend functionality

```
export const routerProps = {
  onError() {}
}

export function RootComponent(props) {
  // if defined, this will wrap the entire site including the router
  // (useful for integration with libraries like react-redux)
}
```

## Usage

```
piezo server    # start the development server
```
```
piezo build     # build your production-ready site
```
```
piezo clean     # clean up all generated files
```
```
piezo build && NODE_ENV=production piezo server    # build your production site and preview locally
```

## Contributing

Feedback and PRs always welcome!
