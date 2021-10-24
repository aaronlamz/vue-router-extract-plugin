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

    apply(compiler) {}
}

module.exports = { VueRouterExtractPlugin }
