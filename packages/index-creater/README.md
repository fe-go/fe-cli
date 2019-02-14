# auto-index

---

根据指定的形式自动生成目录的索引

## auto-index 的目的

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
export { default as Button, IButtonProps } from "./button"
export { default as FooBar, IFooBarProps } from "./foo-bar"
export { default as Nest, INestProps } from "./nest"
export { default as ChildNest, IChildNestProps } from "./nest/child-nest"
export {
  default as GrandsonNest,
  IGrandsonNestProps
} from "./nest/child-nest/grandson-nest"
```

## 安装

```bash
$ npm install index-creater
```

## example

```js
const autoIndex = require("../index")

autoIndex("components", {
  match: "**/!(*.*)", // 此处参数为glob类型
  separator: /(-|_)/g,
  exportPattern: `export { default as [name] , I[name]Props } from '[path]'`,
  suffix: ".js"
})
传参兼容数组形式
添加过滤条件
添加一个扩展回调 参数传入 所以配置的 name 和 path
添加命令行调用方式
添加配置文件
```
