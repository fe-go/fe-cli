# fe-cli
[![](https://badge.fury.io/js/fe-cli.svg)](http://badge.fury.io/js/fe-cli)

一个 cli 工具，集成各种前端开发需要用的功能，持续迭代中!!!,欢迎贡献想法或者功能。

简体中文 ｜ [English](./README-en_US.md)

[目录](#fe-cli)
  - [安装](#安装)
  - [视频切片](#视频切片)
  - [展示文件diff](#展示文件diff)
  - [获取本机IP](#获取本机ip)
  - [URL转qrcode](#url转qrcode)

## 安装

`$ npm i @fe-go/fe-cli -g`

## 视频切片
基于 [HTTP Live Streaming](https://zh.wikipedia.org/wiki/HTTP_Live_Streaming)  通过 ffmpeg 将视频分割为多份以达到视频秒开的目的。

了解更多看这里[视频秒开操作指南](https://juejin.cn/post/6979223117415579656)

前提本机需要安装 ffmpeg （70多M实在难以内置） 推荐通过 homebrew 安装 
- 安装 homebrew `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- 安装 ffmpeg `$ brew install ffmpeg`

`fe hls <file.mp4> <outdir>`

* `file.mp4` 切片的mp4文件
* `outdir` 输出路径

示例:

`fe hls test.mp4 ./`

## 展示文件diff
展示两个文件间的diff

`$ fe diff <file1> <file2> --code`

- `code` 当电脑中已经安装了vscode并且code命令已经添加到环境变量中就可以使用vscode显示文件DIFF。


示例：

```
// example1.js
function example(firstName, lastName) {
  console.log(firstName + " " + lastName)
}

// example2.js
function example(firstName, lastName) {
  console.log('He/She is: ')
  console.log(firstName + "/" + lastName)
}
```

`$ fe diff example1.js example2.js`

结果
```
  function example(firstName, lastName) {
-   console.log(firstName + " " + lastName)
+   console.log('He/She is: ')
  console.log(firstName + "/" + lastName)
  }

```

`$ fe diff file1 file2 --code`
## iconfont 转化

`$ fe iconfont <src> [dest] ` 
- `src` `iconfont` 源文件目录
- `dest` 输出路径

去掉iconfont中冗余的引用资源,将需要引用的`.ttf`资源自动转化为`base64`,简化 iconfont 引入方式。

转化前：`@font-face`如下依照浏览器兼容情况我们只要保留`ttf`就ok了。

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

转化后：如下去掉冗余部分，并将`ttf`转为`base64`

```less
@font-face { 
  font-family: "iconfont";
  src: url('data:font/ttf;charset=utf-8;base64,....') format('truetype');
  }

```
## 获取本机IP
通过`fe IP`命令可以获取本机IP

## URL转qrcode

`fe qr <URL> --small`

* `<URL>` 被转换的URL地址
* `-S/--small` 可选值表示得到小尺寸的二维码

示例：

`fe qr www.github.com`

`fe qr www.github.com -small` / `fe qr www.github.com -S`
  