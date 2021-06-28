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

`fe hls <file.mp4> <outdir>`

* `file.mp4` mp4file read to cut
* `outdir` output directory

exmaple:

`fe hls test.mp4 ./`

## show diff betweeen different files
`$ fe diff <file1> <file2>`

If computer is installed vscode and command code has been added into environment variable, option`--code` can be used to show diff in vscode.

`fe diff file1 file2 --code`

example:

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

## get local public IP address
`fe IP`

## transfer URL to qrcode

`fe qr <URL> -S/--small`

* `<URL>` converted URL
* `-S/--small` optional to get small size qrcode

example:

`fe qr www.github.com` get default size

`fe qr www.github.com -small` / `fe qr www.github.com -S` get small size qrcode