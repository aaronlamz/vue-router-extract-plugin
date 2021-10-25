<div align="center">
  <img width="200" height="200" src="https://cdn.worldvectorlogo.com/logos/logo-javascript.svg">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <h1>vue-router-extract-plugin</h1>
</div>

[![build status](https://github.com/Aaronlamz/vue-router-extract-plugin/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/Aaronlamz/vue-router-extract-plugin/actions/workflows/npm-publish.yml)

# vue-router-extract-plugin
This plugin extracts vue-router route path and title into new file.

## Getting Started
To begin, you'll need to install vue-router-extrace-plugin:

### use npm
```javascript
npm install --save-dev vue-router-extract-plugin
```

### use yarn
```javascript
yarn add -D vue-router-extract-plugin
```

## Options
Name        | Type        | Default | Description
------------|-------------|---------|-----------
projectName | `{String}`  | `'default'`    | This option determines the name of window object attribute
 inputFileDir| `{String}`  | `''`    | This option determines the dir of source file
outputFileName| `{String}`  | `'routemap.js'`    | This option determines the fileName of output file
#### `projectName`

Type: `String`
Default: `window['default-routemap']`
This option determines the name of window object attribute

#### `inputFileDir`

Type: `String`
Default: `''`
This option determines the dir of source file

#### `outputFileName`

Type: `String`
Default: `'routemap.js'`
This option determines the fileName of output file

## Examples
```javascript
// source dir ./src/router/modules/quotes.js
const routes = [
    {
        name: 'goods-manage',
        path: '/goods-manage',
        component: () => import('@/pages/views/quotes/goods/index.vue'),
        meta: { title: 'goods' }
    }
]
export default routes
```

```javascript
// ./vue.config.js
const VueRouterExtractPlugin = require('vue-router-extract-plugin')

const config = {
configureWebpack: {
        // plugins config
        plugins: [
            new VueRouterExtractPlugin({
                projectName: 'app',
                inputFileDir: resolve('../src/router/modules/*.js')
            })
        ]
    },
}
```
```javascript
// output file routemap.js content
window['app-routemap'] = {
    "path: '/goods-manage'": "'goods'",
}
```
## License
[MIT](./LICENSE.md)
