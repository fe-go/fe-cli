const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const _ = require('lodash')

/**
 *
 * @param {string} filePath 文件路径
 */
function convert2base64(filePath) {
  let data = fs.readFileSync(path.resolve(filePath))
  data = Buffer.from(data).toString('base64')
  //   return 'data:' + mime.lookup(filePath) + ';base64,' + data

  return 'data:' + mime.lookup(filePath) + ';charset=utf-8' + ';base64,' + data
}

/**
 * 将iconfont css 源文件转化为想要的形式
 * @param {string} filePath 文件路径
 */
function convertIconfont(config) {
  const str = fs.readFileSync(path.join(config.src, 'iconfont.css')).toString()
  const matchNames = []
  const arr = str.split(/\n/g)
  let destCss = arr.slice(6).join('\n')

  const base64 = convert2base64(path.join(config.src, 'iconfont.ttf'))

  const template = `@font-face { 
  font-family: "iconfont";
  src: url('${base64}') format('truetype');
  }

${destCss}`

  fs.writeFileSync(`${config.dest}/iconfont.css`, template)
}
/**
 * 将匹配的class name 转换为 typescript type
 * @param {Array} matchNames matchNames
 */
function convertMatchNames(matchNames) {
  const matchType = matchNames.join(`' | '`)

  return `export type iconType = '${matchType}'
export const icons = ${JSON.stringify(matchNames)}
    `
}

module.exports = (src, dest) => {
  const config = {
    fontSize: 36,
    // pattern: 'camelCase',
    src,
    dest
  }

  if (!fs.existsSync(config.dest)) fs.mkdirSync(config.dest)
  convertIconfont(config)
}
