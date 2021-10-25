/**
 * @Description A vue router extraction Webpack plugin.
 * @Author AaronLam
 * @Date 2021-09-17
 */

import fs from 'fs'
import glob from 'glob'

class VueRouterExtractPlugin {
    static defaultOptions = {
        projectName: 'default',
        outputFileName: 'routemap.js',
        inputFileDir: '',
    }

    constructor(options) {
        this.name = 'VueRouterExtractPlugin'
        this.routeMap = {}
        this.options = { ...VueRouterExtractPlugin.defaultOptions, ...options }
        const inputFileDirList = glob.sync(this.options.inputFileDir)
        inputFileDirList.forEach((path) => {
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
                    pathList.forEach((routePath, index) => {
                        this.routeMap[routePath] = titleList[index]
                    })
                }
            } catch (err) {
                throw err
            }
        })
    }

    apply(compiler) {
        const pluginName = VueRouterExtractPlugin.name
        const instance = this
        compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
            compilation.assets[instance.options.outputFileName] = {
                source() {
                    return `window['${
                        instance.options.projectName
                    }-routemap'] = ${JSON.stringify(instance.routeMap)}`
                },
                size() {
                    return JSON.stringify(instance.routeMap).length
                },
            }
            callback()
        })
    }
}

export default VueRouterExtractPlugin
