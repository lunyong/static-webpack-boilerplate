const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const { entry, entryModule } = require('./build/utils')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const devConfig = require('./config/dev.config')
const prodConfig = require('./config/prod.config')

console.log('env', process.env.NODE_ENV)
console.log('entry', entry)
const envConfig = process.env.NODE_ENV === 'development' ? devConfig : prodConfig

const htmlPlugins = []
entryModule.forEach(element => {
  htmlPlugins.push(new htmlWebpackPlugin({
    filename: element + '.html',
    template: './src/page/' + element + '.ejs',
    chunks: ['styles', element],
    minify: false
  }))
})

module.exports = webpackMerge({
  mode: 'development',
  entry: entry,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      jquery: path.resolve(__dirname, 'src/asset/js/jquery-3.4.1.min.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: ['underscore-template-loader']
      },
      {
        test: /\.(png|jpg|gif|jpeg|ico|woff|woff2|svg|ttf|eot)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath(url) {
              return url.replace('src/', '')
            }
          }
        }]
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
            options: {
              publicPath(url, ctx) {
                return (path.relative(path.dirname(url), path.resolve(__dirname, 'src')) + '/').replace(/\\/g, '/')
              },
            }
          },
          'css-loader', 
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    new miniCssExtractPlugin({
      filename: 'asset/css/[name].css',
    })
  ].concat(htmlPlugins),
  optimization: {
    splitChunks: {
      chunks(chunk) {
        console.log('chunck', chunk.name)
      },
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          priority: 20
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]asset[\\/](js|plugin)[\\/]/,
          minChunks: 1,
          priority: -10,
          chunks: 'all',
          minChunks: 1
        },
      }
    }
  }
}, envConfig)




