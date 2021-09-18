/**
 * @Description vue-router-extract-plugin
 * @Author Aaron Lam
 * @Date 20210917
 */
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { name } = require('../package.json')
const resolve = dir => path.resolve(__dirname, dir)

function VueRouterExtractPlugin() {
    this.routeDir = resolve('../src/router/modules/*.js')
    this.routeDirs = glob.sync(this.routeDir)
    this.routesMap = {}
    this.routeDirs.forEach(path => {
        try {
            const data = fs.readFileSync(path, 'utf-8')
            const routePathList = data.match(/path:.*'(.+).*'(?=,)/g)
                ? data.match(/path:.*'(.+).*'(?=,)/g)
                : []
            const routeTitleList = data.match(/(?<=title:).*'(.+)'/g)
                ? data.match(/(?<=title:).*'(.+)'/g)
                : []
            if (routePathList.length) {
                routePathList.forEach((path, index) => {
                    this.routesMap[path] = routeTitleList[index]
                })
            }
        } catch (err) {
            throw err
        }
    })
}

VueRouterExtractPlugin.prototype.apply = function(compiler) {
    const routePathTitleMap = this.routesMap
    compiler.plugin('emit', function(compilation, callback) {
        compilation.assets['routesMap.js'] = {
            source: function() {
                return `window['${name}_routesMap'] = ${JSON.stringify(
                    routePathTitleMap
                )}`
            },
            size: function() {
                return JSON.stringify(routePathTitleMap).length
            }
        }

        callback()
    })
}

module.exports = VueRouterExtractPlugin
