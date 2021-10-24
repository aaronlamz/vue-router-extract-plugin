/**
 * @Description A vue router extraction Webpack plugin.
 * @Author AaronLam
 * @Date 2021-09-17
 */

import fs from 'fs'

import glob from 'glob'

const defaultOptions = {
  projectName: 'default',
  outputFileName: 'routemap.js',
  inputFileDir: '',
};

function VueRouterExtractPlugin(options = {}) {
  this.routeMap = {};
  this.options = { ...defaultOptions, ...options };
  const inputFileDirList = glob.sync(this.options.inputFileDir);
  inputFileDirList.forEach((path) => {
    try {
      const data = fs.readFileSync(path, 'utf-8');
      const pathRegExp = /path:.*'(.+).*'(?=,)/g;
      const titleRexExp = /(?<=title:).*'(.+)'/g;
      const pathList = data.match(pathRegExp)
        ? data.match(pathRegExp)
        : [];
      const titleList = data.match(titleRexExp)
        ? data.match(titleRexExp)
        : [];
      if (pathList.length) {
        pathList.forEach((routePath, index) => {
          this.routeMap[routePath] = titleList[index];
        });
      }
    } catch (err) {
      throw err;
    }
  });
}

// eslint-disable-next-line func-names
VueRouterExtractPlugin.prototype.apply = function (compiler) {
  const instance = this;
  compiler.hooks.emit.tapAsync('vue-router-extract-plugin', (compilation, callback) => {
    // eslint-disable-next-line no-param-reassign
    compilation.assets[instance.options.outputFileName] = {
      source() {
        return `window['${
          instance.options.projectName
        }-routemap'] = ${JSON.stringify(instance.routeMap)}`;
      },
      size() {
        return JSON.stringify(instance.routeMap).length;
      },
    };
    callback();
  });
};

module.exports = VueRouterExtractPlugin;
