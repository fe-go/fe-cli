const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const {
    fileInfoParse,
    fileInfoParseAutoExport
} = require('./lib/fileInfoParse')

/**
 * @param {Object|Array} config
 * @prop {String} match 子模块的匹配规则 glob pattern
 * @prop {Regex} separator 子模块目录(文件)命名分割符默认为 /(-|_)/g
 * @prop {String} exportPattern 子模块导出模板
 * @prop {String} suffix 生成index文件的后缀默认为 '.js'
 * @prop {String|Array} ignore glob pattern or glob pattern array
 * @prop {(template,items)=>String} callback 自定义回调函数,template 为引进生成的文件模板，items 匹配的文件信息，返回值为新的模板
 */
function createIndex(options = {}) {
    const {
        match,
        root,
        separator = /(-|_)/g,
        exportPattern,
        suffix = 'js',
        ignore = false,
        callback = () => {}
    } = options
    const rootPath = path.resolve(root)
    const outPath = path.join(rootPath, `index.${suffix.replace(/\./g, '')}`)
    let ignorePattern = []
    let items = []
    if (ignore) {
        const globs = ignore.constructor === Array ? ignore : [ignore]
        ignorePattern = globs.map(x => path.resolve(rootPath, x))
    }

    items = exportPattern
        ? fileInfoParse({
            rootPath,
            match,
            ignorePattern,
            separator,
            exportPattern
        })
        : fileInfoParseAutoExport({ rootPath, match, ignorePattern, separator })

    const template = items
        .map(({ exportTemplate }) => exportTemplate)
        .join('\n')
    const result = callback(template, items) || template

    fs.writeFileSync(outPath, `${result}\n`)
    console.log(
        chalk.green(
            `${path.join(
                rootPath,
                `index.${suffix.replace(/\./g, '')}`
            )} update succeed!`
        )
    )
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
    if (config.constructor === Array) {
        configs = config
    }
    configs.forEach(config => {
        createIndex(config)
    })
}
