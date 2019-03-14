const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const glob = require("glob")
/**
 * 自动生成索引文件
 * @param {String} root 要生成索引的根目录,绝对路径或者现对路径，如果是相对路径会通过path.resolve转为绝对路径
 * @prop {String} match 子模块的匹配规则 glob pattern
 * @prop {Regex} separator 子模块目录(文件)命名分割符默认为 /(-|_)/g
 * @prop {String} exportPattern 子模块导出模板
 * @prop {String} suffix 生成index文件的后缀默认为 '.js'
 * @prop {String|Array} ignore glob pattern or glob pattern array
 * @prop {(template,items)=>String} callback 自定义回调函数,template 为引进生成的文件模板，items 匹配的文件信息，返回值为新的模板
 * @desc
 * 假设有目录结构如下自动生成componets的索引文件index.js
 * - componets
 *  + button
 *    - index.js
 *  + foo-bar
 *    - index.js
 *  + nest
 *    + child-nest
 *      - index.js
 *      + grandson-nest
 *        - index.js
 * 自动生成components/index.js
 *
 *  export { default as Button , IButtonProps } from './button'
 *  export { default as FooBar , IFooBarProps } from './foo-bar'
 *  export { default as Nest , INestProps } from './nest'
 *  export { default as ChildNest , IChildNestProps } from './nest/child-nest'
 *  export { default as GrandsonNest , IGrandsonNestProps } from './nest/child-nest/grandson-nest'
 * @example
 *  indexCreater({
 *   root:'components'
 *   match: '*.js',// 此处参数为glob类型
 *   separator: /(-|_)/g,
 *   exportPattern: `export { default as [name] , I[name]Props } from '[path]'`
 * })
 * indexCreater([
 *   {
 *     root: "components", // 绝对路径或者现对路径，如果是相对路径会通过path.resolve转为绝对路径
 *     match: "xxx/xxx", // 此处参数为glob类型
 *     separator: /(-|_)/g,
 *     exportPattern: `export { default as [name] , I[name]Props } from '[path]'`,
 *     ignore:'button', // glob pattern 或者 glob pattern Array
 *     suffix: ".ts",
 *     callback(template, items) {
 *       return template + "\n// test";
 *     }
 *   },
 *   {
 *     root: "otherComponents",
 *     match: "xxx/xxx", // 此处参数为glob类型
 *     separator: /(-|_)/g,
 *     exportPattern: `export { default as [name] } from '[path]'`,
 *     suffix: ".jsx"
 *   }
 * ]);
 * @todo
 *  [ ] custom getName function
 *  [ ] 添加配置文件添加命令行调用方式
 */

function createIndex(options = {}) {
  const {
    match,
    root,
    separator = /(-|_)/g,
    exportPattern,
    suffix = "js",
    ignore = false,
    callback = () => {}
  } = options
  const rootPath = path.resolve(root)
  let ignorePattern = false
  if (ignore) {
    const globs = ignore.constructor === Array ? ignore : [ignore]
    
    ignorePattern = globs.map(x => path.resolve(rootPath, x))
  }
  const dirs = glob.sync(path.resolve(rootPath, match), {
    ignore: ignorePattern
  })

  const items = dirs.map(filePath => {
    const name = getPascal(path.parse(filePath).name, separator)
    const relativePath = `./${path.relative(rootPath, filePath)}`

    const exportTemplate = exportPattern
      .replace(/\[name\]/g, name)
      .replace(/\[path\]/g, relativePath)

    return { exportTemplate, name, relativePath, filePath }
  })

  const template = items.map(({ exportTemplate }) => exportTemplate).join("\n")
  const result = callback(template, items) || template

  fs.writeFileSync(
    path.join(rootPath, `index.${suffix.replace(/\./g, "")}`),
    `${result}\n`
  )
  console.log(
    chalk.green(
      `${path.join(
        rootPath,
        `index.${suffix.replace(/\./g, "")}`
      )} update succeed!`
    )
  )
}

/**
 * 将传入的字符串的首字母转为大写
 */
function capitalize([first, ...rest]) {
  return first.toUpperCase() + rest.join("")
}
/**
 *
 * @param {String} x 传入字符串
 * @param {RegExp} separator 分割符号
 * @example
 * getPascal('action-sheet',/(-|_)/g)
 * => 'ActionSheet'
 * @example
 *  getPascal('action',/(-|_)/g)
 * => 'Action'
 */
function getPascal(x, separator) {
  const arr = x.split(separator)
  let str = capitalize(x)
  if (arr.length > 1) {
    str = arr.reduce((a, b) => capitalize(a) + capitalize(b))
  }
  // str.replace(separator, "") 是为了处理当
  return str.replace(separator, "")
}
/**
 * @param {Object|Array} config
 * @prop {String} match 子模块的匹配规则 glob pattern
 * @prop {Regex} separator 子模块目录(文件)命名分割符默认为 /(-|_)/g
 * @prop {String} exportPattern 子模块导出模板
 * @prop {String} suffix 生成index文件的后缀默认为 '.js'
 * @prop {String|Array} ignore glob pattern or glob pattern array
 * @prop {(template,items)=>String} callback 自定义回调函数,template 为引进生成的文件模板，items 匹配的文件信息，返回值为新的模板
 */
module.exports = config => {
  let configs = [config]
  if (config.length) {
    configs = config
  }
  configs.forEach(config => {
    createIndex(config)
  })
}
