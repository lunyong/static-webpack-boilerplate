const webpackGlobEntry = require('webpack-glob-entry')

const entryModule = []

const entry = webpackGlobEntry(filePath => {
  const module = filePath.replace('./src/page/', '').replace('.js', '')
  entryModule.push(module)
  return module
}, './src/page/**/*.js')

module.exports = {
  entry,
  entryModule,
}