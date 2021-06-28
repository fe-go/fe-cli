# fe-cli

[简体中文](./README.md) ｜ English(./README-en_US.md)

[fe-cli](https://github.com/fe-go/fe-cli)

- [fe-cli](#fe-cli)
  - [install](#install)
  - [view video immediately](#view-video-immediately)
  - [show diff betweeen different files](#show-diff-betweeen-different-files)
  - [get local public IP address](#get-local-public-ip-address)
  - [transfer URL to qrcode](#transfer-url-to-qrcode)

## install

`$ npm i @fe-go/fe-cli -g`
## view video immediately
In the case of slow Internet, it is usually to load a video for a long time, if the size of video is large. Spliting video into parts can help xxx to load a video clip rather than the whole video at the beginning. 

`fe hls xxx.mp4 dist`

## show diff betweeen different files
`fe diff file1 file2`

If computer is installed vscode and command code has been added into environment variable, option`--code` can be used to show diff in vscode.

`fe diff file1 file2 --code`

## get local public IP address
`fe IP`

## transfer URL to qrcode

get default size qrcode

`fe qr URL`

option `-S`/`--small` can be selected to get small size qrcode, if default width and height are too long.

`fe qr URL -S/--small`