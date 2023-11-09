const fs = require('fs')
const path = require('path')
const { red } = require('chalk')
const esprima = require('esprima')
const ast = require('./ast')
const glob = require('glob')
const getPascal = require('./getPascal')

/**
 * 解析匹配的文件，并返回整合后的信息
 */
function fileInfoParse({
    rootPath,
    match,
    ignorePattern,
    separator,
    exportPattern
}) {
    let items = []
    const dirs = glob.sync(path.resolve(rootPath, match), {
        ignore: ignorePattern
    })

    items = dirs.map((filePath) => {
        const name = getPascal(path.parse(filePath).name, separator)
        const relativePath = `./${path.relative(rootPath, filePath)}`
        const parsePath = path.parse(relativePath)
        const basePath = parsePath.dir + parsePath.name

        const exportTemplate = exportPattern
            .replace(/\[name\]/g, name)
            .replace(/\[path\]/g, basePath)

        return { exportTemplate, name, relativePath, filePath }
    })
    return items
}

/**
 * 解析匹配的文件，并自动解析文件的export，返回整合活的文件信息
 * @param {*} param0
 */
function fileInfoParseAutoExport({
    rootPath,
    match,
    ignorePattern,
    separator
}) {
    const files = glob.sync(path.resolve(rootPath, match), {
        ignore: ignorePattern
    })
    const items = []
    files.forEach((filePath) => {
        const pathOpt = path.parse(filePath)
        const code = fs.readFileSync(filePath, { encoding: 'utf8' })

        try {
            const tree = esprima.parseModule(code)
            const ctx = ast.filterExport(tree)
            const relativePath = `./${path.relative(rootPath, filePath)}`
            const name = getPascal(
                pathOpt.name !== 'index'
                    ? pathOpt.name
                    : path.basename(pathOpt.dir),
                separator
            )

            let list = []
            if (ctx.default) list.push(`default as ${name}`)
            list = list.concat(ctx.name)

            const exportTemplate = list.length
                ? `export { ${list.join(', ')} } from '${relativePath}'`
                : ''
            items.push({ exportTemplate, name, relativePath, filePath })
        } catch (ex) {
            console.log(red(ex))
        }
    })
    return items
}
module.exports = { fileInfoParse, fileInfoParseAutoExport }
