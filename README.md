# static-webpack-boilerplate
基于webpack搭建的输出纯静态页面的开发环境和范例

1. 使用ejs处理公共html代码
2. 本框架输出静态页面，除了插件，不涉及其它js交互。若想输出页面js，需要修改prod.config.js，调用asset-filter-plugin和html-filter-webpack-plugin两个插件时，不传入exclude就行。

asset-filter-plugin 静态资源过虑插件
使用：new assetFilterPlugin(options)
options.excludes  输出的静态资源中需要排除的文件或模块
options.entry  webpack入口模块

html-filter-webpack-plugin html-webpack-plugin插件的子插件，用于修正输出的html文件中静态资源的引用路径
使用：new htmlFilterWebpackPlugin(options)
options.excludes  指定页面引用的css和js中需要排除的部分
options.entry  webpack入口模块
