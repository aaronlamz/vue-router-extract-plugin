/**
 * @Description A vue router extraction Webpack plugin.
 * @Author AaronLam
 * @Date 2021-09-17
 * @github https://github.com/Aaronlamz/vue-router-extract-plugin
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const resolve = dir => path.resolve(__dirname, dir)
const defaultOptions = {
    projectName: 'default',
    outputFile: 'routemap.js',
    inputFileDir: ''
}

function VueRouterExtractPlugin(options = {}) {
    this.routeMap = {}
    this.options = { ...defaultOptions, ...options }
    const inputFileDirList = glob.sync(this.options.inputFileDir)
    inputFileDirList.forEach(path => {
        try {
            const data = fs.readFileSync(path, 'utf-8')
            const pathRegExp = /path:.*'(.+).*'(?=,)/g
            const titleRexExp = /(?<=title:).*'(.+)'/g
            const pathList = data.match(pathRegExp)
                ? data.match(pathRegExp)
                : []
            const titleList = data.match(titleRexExp)
                ? data.match(titleRexExp)
                : []
            if (pathList.length) {
                pathList.forEach((path, index) => {
                    this.routeMap[path] = titleList[index]
                })
            }
        } catch (err) {
            throw err
        }
    })
}

VueRouterExtractPlugin.prototype.apply = function(compiler) {
    const instance = this
    compiler.plugin('emit', function(compilation, callback) {
        compilation.assets[instance.options.outputFile] = {
            source: function() {
                return `window['${
                    instance.options.projectName
                }-routemap'] = ${JSON.stringify(instance.routeMap)}`
            },
            size: function() {
                return JSON.stringify(instance.routeMap).length
            }
        }
        callback()
    })
}

module.exports = VueRouterExtractPlugin
