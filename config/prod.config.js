const { entryModule } = require('../build/utils')
const htmlFilterWebpackPlugin = require('../build/html-filter-webpack-plugin')
const assetsFilterPlugin = require('../build/assets-filter-plugin')

let assetsExcludes = []
entryModule.forEach(element => {
  assetsExcludes.push(element + '.js')
});
assetsExcludes = assetsExcludes.concat(['styles.js'])

module.exports = {
  plugins: [
    new htmlFilterWebpackPlugin({
      excludes: assetsExcludes
    }),
    new assetsFilterPlugin({
      excludes: assetsExcludes
    })
  ]
}