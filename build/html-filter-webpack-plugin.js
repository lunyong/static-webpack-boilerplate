const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const _ = require('lodash')

class HtmlFilterWebpackPlugin {
  constructor(options = {}) {
    /**
     * excludes 需要排除的模块
     */
    this.excludes = options.excludes || []
    this.entry = options.entry || []
    this.outputPath = options.outputPath || path.resolve(__dirname, 'dist').replace(/\\/g, '/')
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlFilterWebpackPlugin', compilation => {
      const hooks = htmlWebpackPlugin.getHooks(compilation)
      hooks.beforeAssetTagGeneration.tapAsync('HtmlFilterWebpackPlugin', (data, callback) => {
        // console.log('htmlwepbackplugin data', data)
        
        if(this.excludes && this.excludes.length) {
          this.filterExcludeQuote(data)
        }
        
        if(this.entry && this.entry.length) {
          this.fixEntranceAssetsQuote(data)
        }
        
        callback()
      })
      
      hooks.beforeEmit.tapAsync('HtmlFilterWebpackPlugin', (data, callback) => {
        this.fixImgQuote(data)
        callback()
      })


      // compilation.plugin('html-webpack-plugin-before-html-processing', (data, callback) => {
      //   console.log('htmlwepbackplugin data', data)
        
      //   if(this.excludes && this.excludes.length) {
      //     this.filterExcludeQuote(data)
      //   }
        
      //   if(this.entry && this.entry.length) {
      //     this.fixEntranceAssetsQuote(data)
      //   }
      //   this.fixImgQuote(data)
        
      //   // console.log('img matches', imgMap)
      // })
    })
    // compiler.plugin('compilation', compilation => {
      
    // })
  }

  /**
   * 修正入口页面html中模块的引用路径，按照文件输出路径进行正确引用
   */
  fixEntranceAssetsQuote(data) {
    this.entry.forEach(item => {
      data.assets.css.forEach((element, index) => {
        if(element.indexOf(item) > -1) {
          const dirname = path.dirname(element)
          const filename = dirname + '.css'
          data.assets.css.splice(index, 1, filename)
        }
      })
      data.assets.js.forEach((element, index) => {
        if(element.indexOf(item) > -1) {
          const dirname = path.dirname(element)
          const filename = dirname + '.js'
          data.assets.js.splice(index, 1, filename)
        }
      })
    })
  }

  /**
   * 过虑排除的模块的引用
   */
  filterExcludeQuote(data) {
    // const jsModule = []
    // data.assets.js.forEach(element => {
    //   // console.log('htmlwepbackplugin dir', path.parse(element))
    //   const pathInfo = path.parse(element)
    //   const dirname = pathInfo.dir.replace(/^\.\.(\/|\\)?/, '')
    //   const filename = pathInfo.name
    //   const item = dirname + (dirname ? '/' : '') + filename
    //   jsModule.push(item)
    // })
    // console.log('js module', data.assets.js, this.excludes)
    this.excludes.forEach((element) => {
      const indexJs = data.assets.js.findIndex(path => {
        return path.indexOf(element) > -1
      })
      if(indexJs > -1) {
        data.assets.js.splice(indexJs)
      }
      const indexCss = data.assets.css.findIndex(path => {
        return path.indexOf(element) > -1
      })
      if(indexCss > -1) {
        data.assets.css.splice(indexCss)
      }
    })
    // console.log('js asset', data.assets.js)
  }

  /**
   * 过虑输出html中img的引用路径，按输出目录的相对路径输出
   */
  fixImgQuote(data) {
    const outputName = data.outputName
    const outputFile = this.outputPath + '/' + outputName
    let relativeTo = path.relative(outputFile, this.outputPath)
    relativeTo = relativeTo.replace(/^\.\.[\/\\]?/, '').replace(/\\/g, '/')
    if(relativeTo) {
      relativeTo += '/'
    }
    // console.log('html relative to asset', outputFile, this.outputPath, relativeTo)

    const imgMatches = data.html.match(/<img.*?(?:>|\/>)/gi) || []
    const imgMap = {}
    imgMatches.forEach(element => {
      imgMap[element] = element.replace(/(<img.*src=[\'\"])(.*)/gi, '$1' + relativeTo + '$2')
    })
    for (const key in imgMap) {
      if (imgMap.hasOwnProperty(key)) {
        const element = imgMap[key];
        data.html = data.html.replace(key, element)
      }
    }
  }
}

module.exports = HtmlFilterWebpackPlugin