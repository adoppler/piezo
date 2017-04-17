const autoprefixer = require('autoprefixer')

module.exports = function configurePostCss(options) {
  const plugins = options.postCSSPlugins || []

  if (!plugins.find(fn => fn.postcssPlugin === 'autoprefixer') && options.autoprefixer !== false) {
    plugins.push(autoprefixer({ browsers: ['last 2 versions'] }))
  }

  return plugins
}
