# iconfont adapter

写了一个小demo自动化将下载iconfont源文件转化为更贴近业务使用的模式，减少手动操作犯错误的机会

## 去掉iconfont中冗余的引用资源并将引用的资源自动转化为base64

转化前：`@font-face`如下依照浏览器兼容情况我们只要保留ttf就ok了

```less
@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1557322756059'); /* IE9 */
  src: url('iconfont.eot?t=1557322756059#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,........') format('woff2'),
  url('iconfont.woff?t=1557322756059') format('woff'),
  url('iconfont.ttf?t=1557322756059') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1557322756059#iconfont') format('svg'); /* iOS 4.1- */
}

```

转化后：如下去掉冗余部分，并将ttf转为base64

```less
@font-face { 
  font-family: "iconfont";
  src: url('data:font/ttf;charset=utf-8;base64,....') format('truetype');
  }

```

## 修改iconfont源css文件中的默认字体大小

```less
.iconfont {
  font-family: "iconfont" !important;
  font-size: 36px;//也就是之定义font-size 值
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

```

## 修改iconfont源css 文件中icon class 的命名规则

转化前

```less
.iconarrow_right:before {
  content: "\e666";
}

.iconarrow_under:before {
  content: "\e667";
}

.iconarrow_on:before {
  content: "\e668";
}
```

转化后: 变成驼峰主要是为了兼容typescript中引入

```less
.icon-arrowRight:before {
  content: "\e666";
}

.icon-arrowUnder:before {
  content: "\e667";
}

.icon-arrowOn:before {
  content: "\e668";
}
```

## 输出typescirpt 类型定义 和 icon 类型数据源

主要是为了方便之后的代码引入，达到更新iconfont之后不需要修改别的地方的源码

```js
export type iconType = 'arrowRight' | 'arrowUnder' | 'arrowOn' | 'closePop' | 'navBack' | 'selectDownRadio' | 'navSearch' | 'selectUp' | 'warning' | 'success' | 'failure' | 'wait' | 'prompt' | 'delete'
export const icons = ["arrowRight","arrowUnder","arrowOn","closePop","navBack","selectDownRadio","navSearch","selectUp","warning","success","failure","wait","prompt","delete"]
```

## run

`$ node index.js`

## 忽略

//icon[\w-]*:

`url('data:<mimetype>;<charset>;base64,..............) format('truetype')`
`url('data:application/x-font-woff2;charset=utf-8;base64,.............)`
mimetype charset 填错了目前看都没有影响   format 填错了不行

mime.contentType('markdown')  // 'text/x-markdown; charset=utf-8'
mime.lookup('json')             // 'application/json'