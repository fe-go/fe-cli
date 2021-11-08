/**
 * 参考: https://github.com/zhanyuzhang/super-tinypng/edit/master/index.js
 *  */

const fs = require('fs')
const path = require('path')
const https = require('https')
const glob = require('glob')
const { blue, green } = require('../lib/color')
const { URL } = require('url')

const cwd = process.cwd()
const root = cwd
const exts = ['.jpg', '.png', '.jpeg']
const max = 5200000 // 5MB == 5242848.754299136

const options = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    rejectUnauthorized: false,
    'Postman-Token': Date.now(),
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  }
}

// 生成随机IP， 赋值给 X-Forwarded-For
function getRandomIP() {
  return Array.from(Array(4))
    .map(() => parseInt(Math.random() * 255))
    .join('.')
}

// 过滤文件格式，返回所有jpg,png图片
function fileFilter(file, dest) {
  fs.stat(file, (err, stats) => {
    if (err) return console.error(err)
    if (stats.size <= max && stats.isFile()) {
      // 通过 X-Forwarded-For 头部伪造客户端IP
      options.headers['X-Forwarded-For'] = getRandomIP()
      fileUpload(file, dest) // console.log('可以压缩：' + file);
    }
    // if (stats.isDirectory()) fileList(file + '/');
  })
}
// 异步API,压缩图片
// {"error":"Bad request","message":"Request is invalid"}
// {"input": { "size": 887, "type": "image/png" },"output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }}
function fileUpload(img, dest) {
  var req = https.request(options, function (res) {
    res.on('data', (buf) => {
      let obj = JSON.parse(buf.toString())
      if (obj.error) {
        console.log(`[${img}]：压缩失败！报错：${obj.message}`)
      } else {
        fileUpdate(img, obj, dest)
      }
    })
  })

  req.write(fs.readFileSync(img), 'binary')
  req.on('error', (e) => {
    console.error(e)
  })
  req.end()
}
// 该方法被循环调用,请求图片数据
function fileUpdate(imgpath, obj, dest) {
  const outputDir = path.resolve(dest)
  const { name, ext } = path.parse(imgpath)
  const fileName = dest === '.' ? name + '.min' : name

  imgpath = path.resolve(dest, fileName + ext)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  let options = new URL(obj.output.url)
  let req = https.request(options, (res) => {
    let body = ''
    res.setEncoding('binary')
    res.on('data', function (data) {
      body += data
    })
    res.on('end', function () {
      fs.writeFile(imgpath, body, 'binary', (err) => {
        if (err) return console.error(err)
        console.log(
          blue('原始大小:'),
          green(`${(obj.input.size / 1000).toFixed(0)}k`),
          blue('压缩大小:'),
          green(`${(obj.output.size / 1000).toFixed(0)}k`),
          blue('优化比例:'),
          green(`- ${((1 - obj.output.ratio) * 100).toFixed(0)}%`),
          blue('图片路径:'),
          green(imgpath)
        )
      })
    })
  })
  req.on('error', (e) => {
    console.error(e)
  })
  req.end()
}

module.exports = (src, dest) => {
  const stats = fs.statSync(path.join(src))
  const fileList = glob.sync(
    stats.isFile() ? src : path.join(src, '*.{png,jpg,jpeg}')
  )
  fileList.forEach((file) => {
    fileFilter(path.join(file), dest)
  })
}
