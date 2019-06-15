const path = require('path')
const _ = require('lodash')

class AssetsFilterPlugin {
  constructor(options = {}) {
    // this.filter = options.filter || {}
    this.excludes = options.excludes || []
    this.entry = options.entry || []
    this.fixOutput = options.fixOutput || false
    this.cssOutputMap = {}
    this.jsOutputMap = {}

    this.init()
  }

  init() {
    if(this.entry && _.isArray(this.entry)) {
      this.entry.forEach(element => {
        let cssfilename = 'asset/css/' + element + '.css'
        let jsfilename = 'asset/js/' + element + '.js'
        this.cssOutputMap[cssfilename] = path.dirname(cssfilename) + '.css'
        this.jsOutputMap[jsfilename] = path.dirname(jsfilename) + '.js'
      })
    }
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('AssetsFilterPlugin', (compilation, callback) => {
      // console.log('compilation asset', compilation.assets)
      this.excludes.forEach(element => {
        if(compilation.assets[element]) {
          delete compilation.assets[element]
        }
      })

      if(this.fixOutput) {
        this.fixCssOutput(compilation)
        this.fixJsOutput(compilation)
      }
      
      callback()
    })
    // compiler.plugin('emit', )
  }

  /**
   * 修正入口页面的css的输出文件，把css文件按照html输出路径关系输出
   */
  fixCssOutput(compilation) {
    for (const key in this.cssOutputMap) {
      if (this.cssOutputMap.hasOwnProperty(key)) {
        const element = this.cssOutputMap[key]
        const cssFile = compilation.assets[key]
        if(cssFile) {
          compilation.assets[element] = cssFile
          delete compilation.assets[key]
        }
      }
    }
  }

  /**
   * 修正入口页面的js的输出文件，把js文件按照html输出路径关系输出
   */
  fixJsOutput(compilation) {
    for (const key in this.jsOutputMap) {
      if (this.jsOutputMap.hasOwnProperty(key)) {
        const element = this.jsOutputMap[key]
        const jsFile = compilation.assets[key]
        if(jsFile) {
          compilation.assets[element] = jsFile
          delete compilation.assets[key]
        }
      }
    }
  }
}

module.exports = AssetsFilterPlugin