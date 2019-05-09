const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const _ = require('lodash')
const config = require('./iconfont.config')
/**
 *
 * @param {string} filePath 文件路径
 */
function convert2base64 (filePath) {
  let data = fs.readFileSync(path.resolve(filePath))
  data = Buffer.from(data).toString('base64')
  //   return 'data:' + mime.lookup(filePath) + ';base64,' + data

  return 'data:' + mime.lookup(filePath) + ';charset=utf-8' + ';base64,' + data
}

/**
 * 将iconfont css 源文件转化为想要的形式
 * @param {string} filePath 文件路径
 */
function convertIconfont (filePath) {
  const str = fs.readFileSync(path.resolve(filePath)).toString()
  const matchNames = []
  const arr = str.split(/\n/g)
  let destCss = arr
    .slice(9)
    .join('\n')
    .replace(/font-size: (\d)+px;/, `font-size: ${config.fontSize}px;`)
  destCss = destCss.replace(/icon([\w-]*):/g, (match, $1) => {
    let className = _[config.pattern]($1)
    matchNames.push(className)
    return `icon-${className}:`
  })

  const base64 = convert2base64(path.join(config.src, 'iconfont.ttf'))

  const template = `@font-face { 
  font-family: "iconfont";
  src: url('${base64}') format('truetype');
  }

${destCss}`

  fs.writeFileSync(`${config.dest}/iconfont.css`, template)
  fs.writeFileSync(
    path.join(config.dest, 'iconType.ts'),
    convertMatchNames(matchNames)
  )
}
/**
 * 将匹配的class name 转换为 typescript type
 * @param {Array} matchNames matchNames
 */
function convertMatchNames (matchNames) {
  const matchType = matchNames.join(`' | '`)

  return `export type iconType = '${matchType}'
export const icons = ${JSON.stringify(matchNames)}
    `
}

function main () {
  if (!fs.existsSync(config.dest)) fs.mkdirSync(config.dest)
  convertIconfont(path.join(config.src, 'iconfont.css'))
}
main()
