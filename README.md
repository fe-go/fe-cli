# fe-cli

简体中文 ｜ [English](./README-en_US.md)

[fe-cli](https://github.com/fe-go/fe-cli)

- [fe-cli](#fe-cli)
  - [安装](#安装)
  - [视频切片](#视频切片)
  - [展示文件diff](#展示文件diff)
  - [获取本机公网IP](#获取本机公网ip)
  - [URL转qrcode](#url转qrcode)

## 安装

`$ npm i @fe-go/fe-cli -g`
## 视频切片
当视频体积太大，在慢网速的情况下，往往可能需要很长时间加载，通过视频切片可以将视频切分成多份，从而缩短视频加载的时间。

`fe hls xxx.mp4 dist`

## 展示文件diff
展示两个文件间的diff

`fe diff file1 file2`

当电脑中已经安装了vscode并且code命令已经添加到环境变量中就可以利用选项`--code`来选择在vscode比较diff

`fe diff file1 file2 --code`

## 获取本机公网IP
通过`fe IP`命令可以获取本机公网IP
## URL转qrcode

获取默认大小的二维码

  `fe qr URL`

如果觉得当前二维码太大，也可以通过`-S`或者`--small`转为较小的二维码
  
  `fe qr [URL] -S/--small`

  