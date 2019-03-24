# index-creater

---

根据指定的形式自动生成目录的索引

## index-creater 的目的

假设有目录结构如下，自动生成 componets 的索引文件 index.js

```bash
  - componets
   + button
     - index.js
   + foo-bar
     - index.js
   + nest
     + child-nest
       - index.js
       + grandson-nest
         - index.js
```

自动生成 components/index.js

```js
export { default as Button, IButtonProps } from "./button";
export { default as FooBar, IFooBarProps } from "./foo-bar";
export { default as Nest, INestProps } from "./nest";
export { default as ChildNest, IChildNestProps } from "./nest/child-nest";
export { default as GrandsonNest, IGrandsonNestProps } from "./nest/child-nest/grandson-nest";
```

## 安装

```bash
$ npm install index-creater
```

## code example

```js
const indexCreater = require("../index");

indexCreater([
    {
        root: 'components', // 绝对路径或者现对路径，如果是相对路径会通过path.resolve转为绝对路径
        match: '**/!(*.*)', // 此处参数为glob类型
        separator: /(-|_)/g,
        exportPattern: 'export { default as [name] , I[name]Props } from \'[path]\'',
        ignore: 'button', // glob pattern 或者 glob pattern Array
        suffix: '.ts',
        callback(template, items) {
            return template + '\n// test'
        }
    },
    {
        root: 'otherComponents',
        match: '**/!(*.*)', // 此处参数为glob类型
        separator: /(-|_)/g,
        exportPattern: 'export { default as [name] } from \'[path]\'',
        suffix: '.jsx'
    },
    // exportPattern 没有填将自动解析 glob 匹配文件的 export
    {
        root: 'autoComponents',
        match: '*/index.*',
        separator: /(-|_)/g,
        suffix: '.js'
    }
])


```
## 自动解析文件export 功能

`exportPattern` 如果没配置自动解析 `glob` 匹配文件的 `export`

### 假设匹配的文件内容如下

```js
export default class foo {}
export const fooVar = 0
```
### 那么生成的`index.js`将自动解析出`export`

```js
export { default as Foo, fooVar } from './foo/index.js'
```
详见`example/autoComponents/`

目前不支持解析`export * from "mod"`的玩法

**感谢**[iZhen](https://github.com/iZhen)添加的自动解析文件`export`功能

## API

 -  `@prop` {String} root 要生成索引的根目录,绝对路径或者现对路径，如果是相对路径会通过path.resolve转为绝对路径
 -  `@prop` {String} match 子模块的匹配规则 glob pattern
 -  `@prop` {Regex} separator 子模块目录(文件)命名分割符默认为 /(-|_)/g
 -  `@prop` {String} exportPattern 子模块导出模板，如果不填`index-creater`将尝试自动解析`glob`匹配的文件`export`
 -  `@prop` {String} suffix 生成index文件的后缀默认为 '.js'
 -  `@prop` {String|Array} ignore glob pattern or glob pattern array
 -  `@prop` {(template,items)=>String} callback 自定义回调函数,template 为引进生成的文件模板，items 匹配的文件信息，返回值为新的模板

 
 